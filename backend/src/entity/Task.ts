import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  completed!: boolean;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user!: User;
}
