import { Task } from "../../types/task";

export function buildTaskBox(task: Task): string {
  
  let template: string = `\
    <div class="taskbox">\
      <div class="tickbox" data-checked="${task.completed}"></div>\
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