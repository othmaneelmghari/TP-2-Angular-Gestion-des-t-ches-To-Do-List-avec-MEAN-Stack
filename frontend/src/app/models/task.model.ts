// Interface représentant une tâche renvoyée par l'API
export interface Task {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
}
