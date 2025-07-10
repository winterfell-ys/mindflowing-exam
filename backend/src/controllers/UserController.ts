import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Task } from "../entity/Task";

export const createUser = async (req: Request, res: Response) => {
  const { id, name } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const userExist = await userRepository.findOneBy({ id: id });
  if (userExist) return res.status(200).json(userExist);
  const user = userRepository.create({ name });
  await userRepository.save(user);
  res.status(201).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await AppDataSource.getRepository(User).find();
  res.json(users);
};
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ id: parseInt(id) });
  if (!user) return res.status(404).json({ error: "User not found" });

  user.name = name;
  await userRepository.save(user);
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userRepository = AppDataSource.getRepository(User);
  const taskRepository = AppDataSource.getRepository(Task);

  const user = await userRepository.findOneBy({ id: parseInt(id) });
  if (!user) return res.status(404).json({ error: "User not found" });

  // 删除该用户的所有任务
  await taskRepository.delete({ userId: parseInt(id) });

  await userRepository.remove(user);
  res.json({ message: "User and associated tasks deleted successfully" });
};
