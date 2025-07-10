export interface TaskVO {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface IUser {
  id: number;
  name: string;
  tasks: TaskVO[];
}
