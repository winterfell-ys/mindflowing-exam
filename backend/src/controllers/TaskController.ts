import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

export const createTask = async (req: Request, res: Response) => {
  const { title, completed, userId } = req.body;
  const taskRepository = AppDataSource.getRepository(Task);
  const userRepository = AppDataSource.getRepository(User);

  // TODO 存在id自增主键问题, 实际上前端输入的userId并不可靠
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const task = taskRepository.create({ title, completed, user });
  await taskRepository.save(task);
  res.status(201).json(task);
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await AppDataSource.getRepository(Task).find({
    relations: ["user"],
  });
  res.json(tasks);
};
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed, userId } = req.body;

  const taskRepository = AppDataSource.getRepository(Task);
  const userRepository = AppDataSource.getRepository(User);

  const task = await taskRepository.findOne({
    where: { id: parseInt(id) },
    relations: ["user"],
  });
  if (!task) return res.status(404).json({ error: "Task not found" });

  const user = await userRepository.findOneBy({ id: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  task.title = title;
  task.completed = completed;
  task.user = user;

  await taskRepository.save(task);
  res.json(task);
};
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const taskRepository = AppDataSource.getRepository(Task);

  const task = await taskRepository.findOneBy({ id: parseInt(id) });
  if (!task) return res.status(404).json({ error: "Task not found" });

  await taskRepository.remove(task);
  res.json({ message: "Task deleted successfully" });
};
