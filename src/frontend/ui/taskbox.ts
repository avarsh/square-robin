import { Task, Subtask } from "../../types/task";
import * as $ from "jquery";

export function buildTaskBox(task: Task, subtaskHTML: string): string {
  
  const selected: string = task.completed ? "selected" : "";
  
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
            <input type='text' />
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
  <div class="subtask-item">
    <div class="subtask-row">\
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

export function useTaskbox() {
  $(".taskbox").click(function(event) {
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
}