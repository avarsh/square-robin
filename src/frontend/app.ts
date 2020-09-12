import * as $ from "jquery";
import * as states from "./states";
import { view } from "./states";
import {ipcRenderer} from "electron";

export function setup() {
  // State is null by default, so hide all divs
  $("body").children().hide();

  if (ipcRenderer.sendSync("dbexists")) {
    view.set(states.taskView);
  } else {
    view.set(states.firstRun);
  }
}