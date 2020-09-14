import * as $ from "jquery";
import { ipcRenderer, remote } from 'electron';
import * as requests from "../types/requests";
import { Task } from "../types/task";
import { useLinked } from "./ui/ui";

export function setupDialog() {
  useLinked();
  $("#deadline-switch-check").change(toggleDate);
  $("#add-task-form").submit((event) => {
    event.preventDefault();
    const description: string = $("#desc").val() as string;
    const size: number = $("#task-size-group").children('.selected').index();
    const id: number = ipcRenderer.sendSync(requests.NEXT_ID);
    const details: Task = {
      id: id,
      description: description,
      size: size,
      completed: false,
      subtasks: []
    };
    
    if ($("#deadline-switch-check").is(":checked")) {
      details.dueDate = new Date($("#due-date").val() as string);
    }
    ipcRenderer.send(requests.ADD_TASK, details);
    remote.getCurrentWindow().close();
    return true;
  });
}

function toggleDate() {
  $("#due-date").prop("disabled", !$('#deadline-switch-check').is(':checked'));
}