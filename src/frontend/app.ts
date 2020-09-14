import * as states from "./states";
import * as $ from "jquery";
import { view } from "./states";
import { ipcRenderer } from "electron";
import * as requests from "../types/requests";
import { Task } from "../types/task";
import { buildTaskBox } from "./ui/taskbox";

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
  let inner: string = "";
  for (let task of tasks) {
    const html: string = buildTaskBox(task);
    inner += html;
  }

  $("#tasks-view .task-list").html(inner);
}