// Task type

type Task = {
  name: string,
  dueDate: Date,
  difficulty: number,
  completed: boolean,
  subtasks: Subtask[]
};

type Subtask = {
  name: string,
  completed: boolean
};

export {Task, Subtask};