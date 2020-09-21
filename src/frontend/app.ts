import * as states from "./states";
import * as $ from "jquery";
import { view } from "./states";
import { setState, buildCompletedList } from "./tasks/states";
import { ipcRenderer } from "electron";
import * as requests from "../types/requests";
import { Task } from "../types/task";
import { buildTaskBox, useTaskbox } from "./ui/taskbox";
import { useTab } from "./ui/tab";

ipcRenderer.on(requests.BUILD_TASKLIST, (event, tasks: Task[]) => {
  if (view.curr === states.tasksView.name) {
    setState(states.tasksView, tasks);
  } else {
    states.tasksView.dirty = true;
  }
});

ipcRenderer.on(requests.BUILD_COMPLETED, (event, tasks: Task[]) => {
  buildCompletedList(tasks);
});

ipcRenderer.on(requests.BUILD_SUBTASKS, (event, task: Task) => {
  const taskbox = $('.task-list').find("[data-id='" + task.id + "']");
  const html: string = buildTaskBox(task);
  taskbox.replaceWith(html);
  useTaskbox(false, false);
});

export function setup() {
  // State is null by default, so clear contents
  $("#content-view").children().hide();
  
  useTab((elem) => {
    if (elem.id === "tasks-btn") {
      view.set(states.tasksView);
    } else if (elem.id === "daily-btn") {
      view.set(states.dailyView);
    }
  });
  

  // Transition into tasks view
  view.set(states.tasksView);
  $("#tasks-btn").addClass("selected");
  
  // Add click handlers for sidebar buttons
  $('#add-task').click(() => {
    ipcRenderer.send(requests.CREATE_ADD_DIALOG);
  });
}