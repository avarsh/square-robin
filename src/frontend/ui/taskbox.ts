import { Task } from "../../types/task";

export function buildTaskBox(task: Task): string {
  
  const selected: string = task.completed ? "selected" : "";
  
  let template: string = `\
    <div class="taskbox" data-id="${task.id}">\
      <div class="tickbox ${selected}" ></div>\
      <div class="task-desc">${task.description}</div>\
      <div class="task-size" data-size="${task.size}">\
        <span class="dot"></span>\
        <span class="dot"></span>\
        <span class="dot"></span>\
      </div>\
      <div class="task-due"></div>\
    </div>\
  `;
  
  return template;
}