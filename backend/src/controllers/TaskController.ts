import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

export const createTask = async (req: Request, res: Response) => {
  const { title, completed, userId } = req.body;
  const taskRepository = AppDataSource.getRepository(Task);
  const userRepository = AppDataSource.getRepository(User);

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
