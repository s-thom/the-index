import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import UserModel from '../../Users/repository/UserModel.entity';

@Entity({ name: 'tags' })
@Unique(['name', 'user'])
export default class TagModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  name!: string;

  @ManyToOne(() => UserModel)
  user!: UserModel;
}
