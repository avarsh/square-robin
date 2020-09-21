import { State, SingleState } from "../../utils/state";
import { Task } from "../../types/task";
import { buildTaskBox, useTaskbox } from "../ui/taskbox";
import * as requests from "../../types/requests";
import * as $ from "jquery";
import { ipcRenderer } from "electron";

const emptyState: State = new SingleState("empty");
const listState:  State = new SingleState("list");

const states: Record<string, State> = {};
states[emptyState.name] = emptyState;
states[listState.name]  = listState;

export function setState(tasksView: State, tasks: Task[]) {
  let prog: number = 0;
  for (let task of tasks) {
    if (!task.completed) {
      prog += 1;
    }
  }

  if (prog == 0) {
    tasksView.set(emptyState);
  } else {
    tasksView.set(listState);
  }
  
  buildCompletedList(tasks);
}

export function buildCompletedList(tasklist: Task[]) {
  let inner: string = "";
  for (let task of tasklist) {
    if (task.completed) {
      const html: string = buildTaskBox(task);
      inner += html;
    }
  }

  $(".completed-task-list").html(inner);
  useTaskbox(true, true);
}

export function fillTasksFromList(tasklist: Task[]) {
  let inner: string = "";
  for (let task of tasklist) {
    if (!task.completed) {
      const html: string = buildTaskBox(task);
      inner += html;
    }
  }

  $("#tasks-view .task-list").html(inner);  
  useTaskbox(true, false);
}

export { states, emptyState, listState }