const {app, BrowserWindow, ipcMain} = require('electron');
const Store = require('./backend/store.js');

function removeFromArray(arr, elem) {
    let idx = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == args) {
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
                username: '',
                tasks: [],
                daily: [],
                timestamp: ''
            }
        });

        this.window = null;
        this.tasksToRemove = []
        this.dailyToRemove = []
        this.idCounter = 0;
        this.today = new Date();
        this.sizeFactor = {'quick' : 1/7, 'long' : 3/7, 'marathon' : 1};
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
            height: 380,
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
            this.window = null; // Dereference
            this.taskDialog = null;
        });

        if (!this.store.firstRun) {
            let tasks = this.store.get("tasks");
            tasks.forEach((element, idx, arr) => {
                this.idCounter = Math.max(this.idCounter, parseInt(element["id"]));
            });
        }
    }
    
    windowClose() {
        if (process.platform !== 'darwin') {
            let tasks = this.store.get('tasks');
            let daily = this.store.get('daily');
            this.tasksToRemove.forEach((id, idx, arr) => {
                removeFromArray(tasks, id);
            });

            this.dailyToRemove.forEach((id, idx, arr) => {
                removeFromArray(daily, id);
            });
    
            this.store.set('tasks', tasks);
            this.store.set('daily', daily);
    
            app.quit();
        }
    }

    canBeScheduled(criteria) {
        if (criteria == 'whenever') return true;

        isWeekend = (today.getDay() == 0) || (today.getDay() == 6);
        if (criteria == 'weekends' && isWeekend) {
            return true;
        }

        if (criteria == 'weekdays' && !isWeekend) {
            return true;
        }

        return false;
    }

    onUserDataRequest(event, arg) {
        if (this.store.firstRun) event.returnValue = null;
        else event.returnValue = this.store.data;
    }

    onUserInfoInput(event, arg) {
        this.store.set('username', arg);
        this.store.firstRun = false;
        event.returnValue = true;
    }

    onProjectSubmit(event, args) {
        this.taskDialog.close();

        this.idCounter++;
        args['id'] = this.idCounter;
        args['date-inputed'] = this.today.toDateString();
        args['status'] = 'normal';
        args['times-scheduled'] = 0;
        args['completed'] = false;
    
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

    onDailyRemove(event, args) {
        this.dailyToRemove.push(args);
        event.returnValue = true;
    }

    onTaskRemoveCancel(event, args) {
        event.returnValue = removeFromArray(this.toRemove, args);
    }

    onDailyRemoveCancel(event, args) {
        event.returnValue = removeFromArray(this.toRemove, args);
    }

    onTaskDialogRequest(event, args) {
        this.taskDialog.show();
        event.returnValue = true;
    }

    onDailyListRequest(event, args) {
        // Generate new tasks
        let tasks = this.store.get('tasks');
        let daily = [];
        tasks.forEach((task, idx, arr) => {
            if (task['status'] == 'urgent') {
                daily.push(task);
            } else {
                let due = new Date(task['date']);
                let timeDiff = due.getTime() - this.today.getTime();
                let daysDiff = timeDiff / (1000 * 3600 * 24);
                let twentyPercent = due.getTime() - (new Date(task['date-inputed'])).getTime();
                twentyPercent = (twentyPercent / (1000 * 3600 * 24)) * 0.2;
                if (daysDiff <= Math.max(3, twentyPercent) * (1 + this.sizeFactor[task['size']]) &&
                    this.canBeScheduled(task['schedule-on'])) {
                    daily.push(task);
                    task['status'] = 'urgent';
                }
            }
        });

        if (daily.length < 5) {
            let potential = [];
            tasks.forEach((task, idx, arr) => {
                if (task['status'] != 'urgent' && 
                    this.canBeScheduled(task['schedule-on'])) {
                    potential.push(task);
                }
            });

            potential.sort((s, t) => {
                let due = new Date(s['date']);
                let timeDiff = due.getTime() - (new Date(s['date-inputed'])).getTime();
                let weeksDiff = timeDIff / (1000 * 3600 * 24 * 7);
                let effort1 = this.sizeFactor[s['size']] * weeksDiff * (1 + (1 / (2 * s['fun'])));

                due = new Date(t['date']);
                timeDiff = due.getTime() - (new Date(t['date-inputed'])).getTime();
                weeksDiff = timeDiff / (1000 * 3600 * 24 * 7);
                let effort2 = this.sizeFactor[t['size']] * weeksDiff * (1 + (1 / (2 * t['fun'])));

                return (s['times-scheduled'] / effort1) - (t['times-scheduled'] / effort2);
            });

            let i = 0;
            while(daily.length <= Math.min(5, potential.length - 1)) {
                daily.push(potential[i]);
                i++;
            }
        }


        const timestamp = this.today.toDateString();
        this.store.set('timestamp', timestamp);
        this.store.set('tasks', tasks);
        this.store.set('daily', daily);

        event.returnValue = daily;
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
ipcMain.on('user-info-input', (event, args) => inst.onUserInfoInput(event, args));
ipcMain.on('project-submit', (event, args) => inst.onProjectSubmit(event, args));
ipcMain.on('task-remove-request', (event, args) => inst.onTaskRemove(event, args));
ipcMain.on('daily-remove-request', (event, args) => inst.onDailyRemove(event, args));
ipcMain.on('task-remove-cancel', (event, args) => inst.onTaskRemoveCancel(event, args));
ipcMain.on('daily-remove-cancel', (event, args) => inst.onDailyRemoveCancel(event, args));
ipcMain.on('daily-list-request', (event, args) => inst.onDailyListRequest(event, args));
ipcMain.on('show-task-dialog', (event, args) => inst.onTaskDialogRequest(event, args));