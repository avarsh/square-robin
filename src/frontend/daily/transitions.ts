import { State } from "../../utils/state";
import * as $ from "jquery";

export function fromTasks(dailyView: State) {
  $("#tasks-view").fadeOut('fast', () => {
    $("#daily-view").fadeIn('fast');
  });
}

export function fromNull(dailyView: State) {
  
}
