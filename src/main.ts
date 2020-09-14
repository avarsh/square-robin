import { app, BrowserWindow, ipcMain } from "electron";
import { createWindow } from "./backend/windows";
import * as db from "./backend/db";
import { handlers } from "./backend/handlers";

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.disableHardwareAcceleration();
app.on("ready", () => {
  createWindow();

  // Setup database
  if(!db.dbExists()) {
    db.setupDB();
  }
  
  // Register handlers
  for (const [request, callback] of Object.entries(handlers)) {
    ipcMain.on(request, callback);
  }

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});