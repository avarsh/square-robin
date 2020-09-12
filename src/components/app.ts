// import "../lib/db";
/*
import { dbExists } from "../lib/db";
import * as states from "./states";
import { view } from "./states";
*/
import * as $ from "jquery";
// import { $, hide } from "../lib/query";

export function setup() {
  // State is null by default, so hide all divs
  $("body").children().hide();
  
  /*if (dbExists()) {
    view.set(states.taskView);
  } else {
    view.set(states.firstRun);
  }*/
}