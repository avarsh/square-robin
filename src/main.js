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
    }

    createWindow() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        });
    
        this.window.loadFile('src/index.html');
        this.window.setMenuBarVisibility(false);
        this.window.on('close', () => {
            this.window = null; // Dereference
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
        this.idCounter++;
        args['id'] = this.idCounter;
    
        let tasks = this.store.get('tasks');
        tasks.push(args);
        this.store.set('tasks', tasks);
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

    onDailyListRequest(event, args) {
        // Generate
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