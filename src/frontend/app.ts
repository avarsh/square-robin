import * as states from "./states";
import * as $ from "jquery";
import { view } from "./states";
import {ipcRenderer} from "electron";

export function setup() {
  // State is null by default, so clear contents
  $("#content-view").children().hide();

  // Transition into tasks view
  view.set(states.tasksView);
}