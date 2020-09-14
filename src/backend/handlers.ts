import { IpcMainEvent } from "electron/main";
import * as requests from "../types/requests";
import { alertOnFail } from "../utils/error";
import { Database, writeDatabase, readDatabase } from "./db";
import { createAddDialog } from "./windows";
import { Task } from "../types/task";

// Create handlers for each request from the renderer

type Callback = (event: IpcMainEvent, args: any) => void;

function getTasks(event: IpcMainEvent, args: any): void {
  const db: Database = alertOnFail(readDatabase());
  if (!!db) { event.returnValue = db.tasks; }
}

function addTask(event: IpcMainEvent, args: any): void {
  const details: Task = args as Task;
  const db: Database = alertOnFail(readDatabase());
  db.tasks.push(details);
  // TODO: Refresh task list with the new db
  writeDatabase(db);
  event.returnValue = true;
}

function nextId(event: IpcMainEvent, args: any[]): void {
  const db: Database = alertOnFail(readDatabase());  
  event.returnValue = db.tasks.length;
}

const handlers: Record<string, Callback> = {};
handlers[requests.GET_TASKS] = getTasks;
handlers[requests.CREATE_ADD_DIALOG] = createAddDialog;
handlers[requests.ADD_TASK] = addTask;
handlers[requests.NEXT_ID] = nextId;

export {handlers};