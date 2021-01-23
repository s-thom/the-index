import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import TagModel from '../../Tags/repository/TagModel.entity';
import UserModel from '../../Users/repository/UserModel.entity';

@Entity({ name: 'links' })
export default class LinkModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  @Index({ unique: true })
  reference!: string;

  @Column({ type: 'text' })
  url!: string;

  @ManyToMany(() => TagModel, { cascade: true })
  @JoinTable()
  tags!: TagModel[];

  @ManyToOne(() => UserModel)
  user!: UserModel;

  @Column({ type: 'text', default: 'private' })
  visibility!: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated?: Date;

  @DeleteDateColumn()
  deleted?: Date;
}
