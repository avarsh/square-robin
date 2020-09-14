// Task type

type Task = {
  id: number,
  description: string,
  dueDate?: Date,
  size: number,
  completed: boolean,
  subtasks: Subtask[]
};

type Subtask = {
  name: string,
  completed: boolean
};

export {Task, Subtask};