import { IpcMainInvokeEvent } from "electron/main";
import { dbExists } from "./db";

// Create handlers for each request from the renderer

function handleDbExists(event: IpcMainInvokeEvent, args: any[]): void {
  event.returnValue = dbExists();
}

const handlers = {
  "dbexists": handleDbExists
};

export {handlers};