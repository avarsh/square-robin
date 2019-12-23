const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const Store = require('./backend/store.js');
const DateHandler = require('./utils/date');
const dateHandler = new DateHandler();

function removeFromArray(arr, elem) {
    let idx = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == elem) {
            idx = i;
        }
    }
    
    if (idx != -1) {
        arr.splice(idx, 1);
        return true;
    }

    return false;
}

function removeFromArrayWithKey(arr, elem, key) {
    let idx = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == elem) {
            idx = i;
        }
    }
    
    if (idx != -1) {
        arr.splice(idx, 1);
        return true;
    }

    return false;
}

class Application {
    constructor() {
        this.store = new Store({
            configName: 'data',
            defaults: {
                tasks: [],
                daily: [],
                timestamp: ''
            }
        });

        this.window = null;
        this.tasksToRemove = []
        this.idCounter = 0;
        this.sizeFactor = {'quick' : 1/7, 'long' : 3/7, 'marathon' : 1};
    }

    getTaskWithId(id, tasks) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]['id'] == id) {
                return tasks[i];
            }
        }
    
        return null;
    }

    createWindow() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            },
            show: false
        });
    
        this.window.loadFile('src/index.html');
        this.window.setMenuBarVisibility(false);
        this.window.on('ready-to-show', () => {
            this.window.show();
        });

        this.taskDialog  = new BrowserWindow({
            parent: this.window,
            modal: true,
            show: false,
            width: 500,
            height: 270,
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.taskDialog.setMenuBarVisibility(false);
        this.taskDialog.loadFile('src/dialog.html');
        this.taskDialog.on('show', (event) => {
            this.taskDialog.webContents.send('show');
        });
        this.taskDialog.on('close', (event) => {
            event.preventDefault();
            this.taskDialog.hide(); 
            this.window.focus();
            this.window.webContents.send('dialog-closed');
        });
    
        this.window.on('close', () => {
            this.windowClose();
            this.window = null; // Dereference
            this.taskDialog = null;
        });

        let tasks = this.store.get("tasks");
        tasks.forEach((element, idx, arr) => {
            this.idCounter = Math.max(this.idCounter, parseInt(element["id"]));
        });
    }
    
    windowClose() {
        if (process.platform !== 'darwin') {
            let tasks = this.store.get('tasks');
            let daily = this.store.get('daily');
            this.tasksToRemove.forEach((id, idx, arr) => {
                // Tasks which are completed should be removed from both
                // all tasks and the daily tasks
                removeFromArrayWithKey(tasks, id, 'id');
                removeFromArray(daily, id, 'id');
            });
    
            this.store.set('tasks', tasks);
            this.store.set('daily', daily);
    
            app.quit();
        }
    }

    onUserDataRequest(event, arg) {
        event.returnValue = this.store.data;
    }

    onProjectSubmit(event, args) {
        this.taskDialog.close();

        this.idCounter++;
        args['id'] = this.idCounter;
        args['date-inputed'] = dateHandler.todayStr;
        args['status'] = 'normal';
        args['times-scheduled'] = 0;
        args['completed'] = false; // TODO: This is currently not used
        args['subtasks'] = []
    
        let tasks = this.store.get('tasks');
        tasks.push(args);
        this.store.set('tasks', tasks);
        this.window.webContents.send('project-submit', this.store.data);
        event.returnValue = this.store.data;
    }

    onTaskRemove(event, args) {
        this.tasksToRemove.push(args);
        event.returnValue = true;
    }

    onTaskRemoveCancel(event, args) {
        event.returnValue = removeFromArray(this.tasksToRemove, args);
        event.returnValue = true;
    }

    onTaskDialogRequest(event, args) {
        this.taskDialog.show();
        event.returnValue = true;
    }

    onSubtaskAdd(event, args) {
        let tasks = this.store.get('tasks');
        let subtask = {};
        subtask['description'] = args['description'];
        subtask['completed'] = false;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]['id'] == args['id']) {
                tasks[i]['subtasks'].push(subtask);
            }
        }

        this.store.set('tasks', tasks);

        event.returnValue = this.store.data;
    }

    onSubtaskComplete(event, args) {
        let tasks = this.store.get('tasks');
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]['id'] == args['id']) {
                tasks[i]['subtasks'][parseInt(args['index'])]['completed'] = args['completed'];
            }
        }

        this.store.set('tasks', tasks);

        event.returnValue = true;
    }
    
    onDailyListRequest(event, args) {
        // Generate new tasks
        let tasks = this.store.get('tasks');
        let daily = [];
        tasks.forEach((task, idx, arr) => {
            if (task['status'] == 'urgent') {
                daily.push(task['id']);
            } else if (task['date'] != null) {
                let due = new Date(task['date']);
                let timeDiff = due.getTime() - dateHandler.today.getTime();
                let daysDiff = timeDiff / (1000 * 3600 * 24);
                let twentyPercent = due.getTime() - (new Date(task['date-inputed'])).getTime();
                twentyPercent = (twentyPercent / (1000 * 3600 * 24)) * 0.2;
                if (daysDiff <= Math.max(3, twentyPercent) * (1 + this.sizeFactor[task['size']])) {
                    daily.push(task['id']);
                    task['status'] = 'urgent';
                }
            }
        });

        if (daily.length < 5) {
            let potential = [];
            tasks.forEach((task, idx, arr) => {
                if (task['status'] != 'urgent' && task['date'] != null) {
                    potential.push(task);
                }
            });

            potential.sort((s, t) => {
                let due = new Date(s['date']);
                let timeDiff = due.getTime() - (new Date(s['date-inputed'])).getTime();
                let weeksDiff = timeDiff / (1000 * 3600 * 24 * 7);
                let effort1 = this.sizeFactor[s['size']] * weeksDiff;

                due = new Date(t['date']);
                timeDiff = due.getTime() - (new Date(t['date-inputed'])).getTime();
                weeksDiff = timeDiff / (1000 * 3600 * 24 * 7);
                let effort2 = this.sizeFactor[t['size']] * weeksDiff;

                return (s['times-scheduled'] / effort1) - (t['times-scheduled'] / effort2);
            });

            let i = 0;
            while(daily.length <= Math.min(4, potential.length - 1)) {
                daily.push(potential[i]['id']);
                i++;
            }
        }


        const timestamp = dateHandler.todayStr;
        this.store.set('timestamp', timestamp);
        this.store.set('tasks', tasks);
        this.store.set('daily', daily);

        event.returnValue = this.store.data;
    }
}

let inst = new Application();

app.on('ready', () => inst.createWindow());
app.on('window-all-closed', () => inst.windowClose());
app.on('activate', () => {
    if (win === null) {
        inst.createWindow();
    }
});

ipcMain.on('user-data-request', (event, args) => inst.onUserDataRequest(event, args));
ipcMain.on('project-submit', (event, args) => inst.onProjectSubmit(event, args));

ipcMain.on('task-remove-request', (event, args) => inst.onTaskRemove(event, args));
ipcMain.on('task-remove-cancel', (event, args) => inst.onTaskRemoveCancel(event, args));

ipcMain.on('daily-list-request', (event, args) => inst.onDailyListRequest(event, args));
ipcMain.on('show-task-dialog', (event, args) => inst.onTaskDialogRequest(event, args));

ipcMain.on('add-subtask', (event, args) => inst.onSubtaskAdd(event, args));
ipcMain.on('complete-subtask', (event, args) => inst.onSubtaskComplete(event, args));

ipcMain.on('show-error', (event, args) => {
    dialog.showErrorBox(args['title'], args['message']);
});
