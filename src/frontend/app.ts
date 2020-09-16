import * as states from "./states";
import * as $ from "jquery";
import { view } from "./states";
import { listState, emptyState } from "./tasks/states";
import { ipcRenderer, webContents, remote } from "electron";
import * as requests from "../types/requests";
import { Task } from "../types/task";
import { buildTaskBox, useTaskbox } from "./ui/taskbox";

ipcRenderer.on(requests.BUILD_TASKLIST, (event, tasks: Task[]) => {
  if (tasks.length > 0) {
    states.tasksView.set(listState);
  }
  fillTasksFromList(tasks);
});

ipcRenderer.on(requests.BUILD_SUBTASKS, (event, task: Task) => {
  const taskbox = $('.task-list').find("[data-id='" + task.id + "']");
  const html: string = buildTaskBox(task);
  taskbox.replaceWith(html);
  useTaskbox(false);
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
    if (!task.completed) {
      const html: string = buildTaskBox(task);
      inner += html;
    }
  }

  $("#tasks-view .task-list").html(inner);  
  useTaskbox(true);
}