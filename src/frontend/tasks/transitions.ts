import { ipcRenderer } from "electron";
import * as $ from "jquery";
import { Task } from "../../types/task";
import { State, NULL_STATE } from "../../utils/state";
import * as requests from "../../types/requests";
import { setState, fillTasksFromList } from "../tasks/states";


export function fromDaily(tasksView: State) {
  $("#daily-view").fadeOut('fast', () => {
    $("#tasks-view").fadeIn('fast');
  });
  
  if (tasksView.curr === NULL_STATE.name || tasksView.dirty) {
    setState(tasksView, ipcRenderer.sendSync(requests.GET_TASKS));
    tasksView.dirty = false;
  }
}

export function fromNull(tasksView: State) {
  $("#tasks-view").show();
  
  $("#tasks-view .empty-list").hide();
  $("#tasks-view .task-list").hide();
  
  // Check if we have any tasks
  const tasks: Task[] = ipcRenderer.sendSync(requests.GET_TASKS);
  setState(tasksView, tasks);
}

export function nullToList(listView: State) {
  $("#tasks-view .task-list").show();
  fillTasksFromList(ipcRenderer.sendSync(requests.GET_TASKS));
}

export function nullToEmpty(emptyView: State) {
  $("#tasks-view .empty-list").show();
}

export function emptyToList(listView: State) {
  $("#tasks-view .empty-list").hide();
  $("#tasks-view .task-list").show();
  fillTasksFromList(ipcRenderer.sendSync(requests.GET_TASKS));
}

export function listToEmpty(emptyView: State) {
  $("#tasks-view .task-list").hide();
  $("#tasks-view .show-list").show();
}

export function listToList(listView: State) {
  fillTasksFromList(ipcRenderer.sendSync(requests.GET_TASKS));
}