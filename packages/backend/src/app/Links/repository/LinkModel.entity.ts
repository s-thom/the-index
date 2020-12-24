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
import Tag from '../../Tags/Tag';
import User from '../../Users/User';

@Entity({ name: 'links' })
export default class LinkModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  @Index({ unique: true })
  reference!: string;

  @Column({ type: 'text' })
  url!: string;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags!: Tag[];

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated?: Date;

  @DeleteDateColumn()
  deleted?: Date;
}
