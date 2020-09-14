import * as states from "./states";
import * as $ from "jquery";
import { view } from "./states";
import { ipcRenderer } from "electron";
import * as requests from "../types/requests";

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
    
  });
  
  $('#tasks-btn').click(() => {
    view.set(states.tasksView);
  });
}