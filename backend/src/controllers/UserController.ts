import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const createUser = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create({ name });
  await userRepository.save(user);
  res.status(201).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await AppDataSource.getRepository(User).find();
  res.json(users);
};
