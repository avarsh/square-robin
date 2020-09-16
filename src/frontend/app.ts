import * as states from "./states";
import * as $ from "jquery";
import { view } from "./states";
import { listState, emptyState } from "./tasks/states";
import { ipcRenderer, webContents, remote } from "electron";
import * as requests from "../types/requests";
import { Task } from "../types/task";
import { buildTaskBox, buildSubtask, useTaskbox } from "./ui/taskbox";
import { useTickbox } from "./ui/ui";

ipcRenderer.on(requests.BUILD_TASKLIST, (event, tasks: Task[]) => {
  if (tasks.length > 0) {
    states.tasksView.set(listState);
  }
  fillTasksFromList(tasks);
});

export function setup() {
  // State is null by default, so clear contents
  $("#content-view").children().hide();
  
  // Transition into tasks view
  view.set(states.tasksView);
  
  // Add click handlers for sidebar buttons
  $('#add-task').click(() => {
    ipcRenderer.send(requests.CREATE_ADD_DIALOG);
  });
  
  $('#daily-btn').click(() => {
    $("#tasks-btn").removeClass("selected");
    $("#daily-btn").addClass("selected");
  });
  
  $('#tasks-btn').click(() => {
    $("#daily-btn").removeClass("selected");
    $("#tasks-btn").addClass("selected");
    view.set(states.tasksView);
  });
  
  $("#tasks-btn").addClass("selected");
  fillTasks();
}

export function fillTasks() {
  const tasks: Task[] = ipcRenderer.sendSync(requests.GET_TASKS);
  fillTasksFromList(tasks);
}

function fillTasksFromList(tasklist: Task[]) {
  let inner: string = "";
  for (let task of tasklist) {
    let subtaskHTML: string = "";
    for (let subtask of task.subtasks) {
      subtaskHTML += buildSubtask(subtask);
    }
    const html: string = buildTaskBox(task, subtaskHTML);
    inner += html;
  }

  $("#tasks-view .task-list").html(inner);  
  useTickbox((tickbox: HTMLElement) => {
    const taskbox = $(tickbox).parent();
    const id: number = parseInt(taskbox.attr("data-id"));
    ipcRenderer.sendSync(requests.SET_TASK_COMPLETE, id, $(tickbox).hasClass("selected"));
  });
  useTaskbox();
}