import { IpcMainInvokeEvent, IpcMainEvent } from "electron/main";
import { readDatabase } from "./db";
import * as requests from "../types/requests";
import { fromVal } from "../utils/functional/either";
import { alertOnFail } from "../utils/error";
import { Database } from "../backend/db";
import { createAddDialog } from "./windows";

// Create handlers for each request from the renderer

type Callback = (event: IpcMainEvent, args: any[]) => void;

function getTasks(event: IpcMainEvent, args: any[]): void {
  const db: Database = alertOnFail(readDatabase());
  if (!!db) { event.returnValue = db.tasks; }
}

const handlers: Record<string, Callback> = {};
handlers[requests.GET_TASKS] = getTasks;
handlers[requests.CREATE_ADD_DIALOG] = createAddDialog;

export {handlers};