import { IpcMainEvent, Data } from "electron/main";
import * as requests from "../types/requests";
import { alertOnFail } from "../utils/error";
import { Database, writeDatabase, readDatabase } from "./db";
import { createAddDialog, mainWindow } from "./windows";
import { Task } from "../types/task";
import { write } from "fs";

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
  for (let task of db.tasks) {
    if (task.id == id) {
      task.completed = setting;
    }
  }
  
  writeDatabase(db);
  event.returnValue = true;
}

function scheduleTask(event: IpcMainEvent, setting: number): void {
  // setting = 0: no scheduling
  // setting = 1: today
  // setting = 2: tomorrow
}

const handlers: Record<string, Callback> = {};
handlers[requests.GET_TASKS] = getTasks;
handlers[requests.CREATE_ADD_DIALOG] = createAddDialog;
handlers[requests.ADD_TASK] = addTask;
handlers[requests.NEXT_ID] = nextId;
handlers[requests.SET_TASK_COMPLETE] = setTaskComplete;

export {handlers};