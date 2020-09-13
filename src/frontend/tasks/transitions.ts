import { ipcRenderer } from "electron";
import * as $ from "jquery";
import { Task } from "../../types/task";
import { State } from "../../utils/state";
import * as tasksStates from "./states";
import * as requests from "../../types/requests";

export function fromDaily(tasksView: State) {
  
}

export function fromNull(tasksView: State) {
  $("#tasks-view").show();
  
  $("#tasks-view .empty-list").hide();
  $("#tasks-view .task-list").hide();
  
  // Check if we have any tasks
  const tasks: Task[] = ipcRenderer.sendSync(requests.GET_TASKS);
  if (tasks.length == 0) {
    tasksView.set(tasksStates.emptyState);
  } else {
    tasksView.set(tasksStates.listState);
  }
}