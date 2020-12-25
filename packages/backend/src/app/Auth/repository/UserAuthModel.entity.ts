import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserModel from '../../Users/repository/UserModel.entity';

@Entity({ name: 'user_auth' })
export default class LinkModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserModel)
  user!: UserModel;

  @Column({ type: 'text' })
  type!: string;

  @Column({ type: 'text' })
  secret!: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated?: Date;

  @DeleteDateColumn()
  deleted?: Date;
}
