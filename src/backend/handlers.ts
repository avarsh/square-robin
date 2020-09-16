import { IpcMainEvent, Data } from "electron/main";
import * as requests from "../types/requests";
import { alertOnFail } from "../utils/error";
import { Database, writeDatabase, readDatabase } from "./db";
import { createAddDialog, mainWindow } from "./windows";
import { Task, Subtask } from "../types/task";

// Create handlers for each request from the renderer

type Callback = (event: IpcMainEvent, ...args: any[]) => void;

function getTasks(event: IpcMainEvent, ...args: any[]): void {
  const db: Database = alertOnFail(readDatabase());
  if (!!db) { event.returnValue = db.tasks; }
}

function addTask(event: IpcMainEvent, args: Task): void {
  const details: Task = args;
  const db: Database = alertOnFail(readDatabase());
  db.tasks.push(details);
  writeDatabase(db);
  mainWindow.webContents.send(requests.BUILD_TASKLIST, db.tasks);
  event.returnValue = true;
}

function nextId(event: IpcMainEvent, ...args: any[]): void {
  const db: Database = alertOnFail(readDatabase());  
  event.returnValue = db.tasks.length;
}

function setTaskComplete(event: IpcMainEvent, id: number, setting: boolean): void {
  const db: Database = alertOnFail(readDatabase());
  // TODO: In future, we may want to keep a dictionary from id to task
  // We might also prefer to keep the database in memory
  if (id >= 0 && id < db.tasks.length) {
    const task: Task = db.tasks[id];
    task.completed = setting;
    writeDatabase(db);
    event.returnValue = true;
    return;
  }
  
  event.returnValue = false;
}

function addSubtask(event: IpcMainEvent, id: number, desc: string): void {
  const db: Database = alertOnFail(readDatabase());
  
  if (id >= 0 && id < db.tasks.length) {
    const task: Task = db.tasks[id];
    task.subtasks.push({
      id: task.subtasks.length,
      description: desc,
      completed: false,
      scheduled: null
    });
    writeDatabase(db);
    mainWindow.webContents.send(requests.BUILD_SUBTASKS, task);
    event.returnValue = true;
    return;
  }

  event.returnValue = false;
}

function scheduleTask(event: IpcMainEvent, setting: number): void {
  // setting = 0: no scheduling
  // setting = 1: today
  // setting = 2: tomorrow
}

function setSubtaskComplete(event: IpcMainEvent, taskId: number, subtaskId: number, setting: boolean): void {
  const db: Database = alertOnFail(readDatabase());
  if (taskId >= 0 && taskId < db.tasks.length) {
    const task: Task = db.tasks[taskId];
    task.subtasks[subtaskId].completed = setting;
    writeDatabase(db);
    event.returnValue = true;
    return;
  }
  
  event.returnValue = false;
}

const handlers: Record<string, Callback> = {};
handlers[requests.GET_TASKS] = getTasks;
handlers[requests.CREATE_ADD_DIALOG] = createAddDialog;
handlers[requests.ADD_TASK] = addTask;
handlers[requests.NEXT_ID] = nextId;
handlers[requests.SET_TASK_COMPLETE] = setTaskComplete;
handlers[requests.ADD_SUBTASK] = addSubtask;
handlers[requests.SET_SUBTASK_COMPLETE] = setSubtaskComplete;

export {handlers};