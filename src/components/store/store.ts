// A module to store data

import { app } from "electron";
import * as path from "path";

import { Task } from "../task";

const configDir = app.getPath("userData");
const dataFile = path.join(configDir, "data.json");

/**
 * Write a task into the store, returning success.
 */
export function writeTask(task: Task): boolean {
  return true;
}

/**
 * Fetch all tasks from the store.
 */
export function getTasks(): Task[] {
  return [];
}