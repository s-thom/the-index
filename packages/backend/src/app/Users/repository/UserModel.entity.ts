import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export default class UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  @Index({ unique: true })
  name!: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated?: Date;

  @DeleteDateColumn()
  deleted?: Date;
}
