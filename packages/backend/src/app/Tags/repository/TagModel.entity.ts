import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserModel from '../../Users/repository/UserModel.entity';

@Entity({ name: 'tags' })
export default class TagModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  @Index({ unique: true })
  name!: string;

  @ManyToOne(() => UserModel)
  user!: UserModel;
}
