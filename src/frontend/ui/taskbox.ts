import { Task, Subtask } from "../../types/task";
import * as $ from "jquery";
import * as requests from "../../types/requests";
import { ipcRenderer } from "electron";
import { useTickbox } from "./ui";

export function buildTaskBox(task: Task): string {
  
  const selected: string = task.completed ? "selected" : "";
  let subtaskHTML: string = "";
  for (let subtask of task.subtasks) {
    subtaskHTML += buildSubtask(subtask);
  }
  
  let template: string = `
    <div class="taskbox" data-id="${task.id}">
      <div class="main-row">
        <div class="tickbox ${selected}" ></div>
        <div class="task-desc">${task.description}</div>
        <div class="task-size" data-size="${task.size}">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="task-due"></div>
      </div>
      <div class="task-schedule">
        <div class="arrow-container">
          <span class="right-arrow"></span>
          <span class="right-arrow"></span>
        </div>
      </div>
      <div class="subtask-box">
        ${subtaskHTML}
        <div class="add-subtask-row">
          <div class="add-button"></div>
          <div class="subtask-name">
            <input type='text' placeholder='Add subtask'/>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return template;
}

export function buildSubtask(subtask: Subtask): string {
  const selected: string = subtask.completed ? "selected" : "";
  const template: string = `
  <div class="subtask-row" data-id="${subtask.id}">
    <div class="subtask-item">\
      <div class="tickbox ${selected}" ></div>\
      <div class="task-desc">${subtask.description}</div>\
    </div>
    <div class="task-schedule">\
      <div class="arrow-container">\
        <span class="right-arrow"></span>\
        <span class="right-arrow"></span>\
      </div>\
    </div>\
  </div>\
  `
  
  return template;
}

export function useTaskbox(hideSub: boolean, completed: boolean, onTick?: (tickbox: HTMLElement) => void) {
  $(".taskbox").off('click').on('click', function(event) {
      // Only detect click on taskbox and not children
      const target = $(event.target);
      const childElems: string[] = [
        "tickbox",
        "task-schedule",
        "add-button",
        "subtask-name"
      ];
      for (const childElem of childElems) {
        if (target.hasClass(childElem) || target.parents("." + childElem).length) {
          return false;
        }
      }

      $(this).children(".subtask-box").slideToggle();
  });
  
  if (hideSub) {
    $(".taskbox").children(".subtask-box").hide();
  }

  $('.subtask-name input').on("keyup", function(event) {
    if (event.keyCode == 13) {
        addSubtask($(this).parents(".add-subtask-row"));
    }
  });
  
  $('.subtask-box .add-button').click(function(event) {
    addSubtask($(this).parents(".add-subtask-row"));
  });
  
  useTickbox((tickbox: HTMLElement) => {
    const taskbox = $(tickbox).parents(".taskbox");
    const id: number = parseInt(taskbox.attr("data-id"));
    if ($(tickbox).parents(".subtask-box").length == 0) {
      ipcRenderer.sendSync(requests.SET_TASK_COMPLETE, id, $(tickbox).hasClass("selected"));
      $(taskbox).animate({height: 0, opacity: 0}, 'slow', () => {
        $(taskbox).remove();
      });
    } else {
      // Subtask
      const subtaskBox = $(tickbox).parents(".subtask-row");
      const subtaskId: number = parseInt(subtaskBox.attr("data-id"));
      ipcRenderer.sendSync(requests.SET_SUBTASK_COMPLETE, id, subtaskId, $(tickbox).hasClass("selected"));
    }
  });
}

function addSubtask(addSubtaskRow: JQuery<HTMLElement> ) {
  const id: number = parseInt(addSubtaskRow.parents('.taskbox').attr('data-id'));
  const desc: string = addSubtaskRow.children('.subtask-name').children('input').val() as string;
  ipcRenderer.sendSync(requests.ADD_SUBTASK, id, desc);
}