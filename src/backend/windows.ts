import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { handlers } from "./handlers";
import * as db from "./db";
import { IpcMainEvent } from "electron/main";

let mainWindow: BrowserWindow;

export function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      nodeIntegration: true
    },
    width: 800,
  });

  mainWindow.setAutoHideMenuBar(true);
  mainWindow.loadFile(path.join(__dirname, "../../index.html"));
}

export function createAddDialog(event: IpcMainEvent, args: any[]) {
  let dialog = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 300,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      nodeIntegration: true
    }
  });
  
  dialog.setAutoHideMenuBar(true);
  dialog.loadFile(path.join(__dirname, "../../dialog.html"));
  dialog.show();
}