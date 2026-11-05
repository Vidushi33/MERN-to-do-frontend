export type TaskStatus = "In Progress" | "Completed";

export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: Date | string;
  priority?: TaskPriority;
  status: TaskStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface createTask {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}
