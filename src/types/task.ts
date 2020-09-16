// Task type

type Task = {
  id: number,
  description: string,
  dueDate?: Date,
  size: number,
  completed: boolean,
  subtasks: Subtask[],
  scheduled: Date | null
};

type Subtask = {
  description: string,
  completed: boolean,
  scheduled: Date | null
};

export {Task, Subtask};