import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsSaEntity } from './posts.sa.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'blogs' })
export class BlogsSaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.blogs)
  @JoinColumn({ name: 'userid' })
  userId: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'description' })
  description: string;

  @Column({ type: 'varchar', name: 'websiteurl' })
  websiteUrl: string;

  @Column({ type: 'varchar', name: 'createdat' })
  createdAt: string;

  @Column({ type: 'boolean', default: false, name: 'ismembership' })
  isMembership: boolean;

  @OneToMany(() => PostsSaEntity, (posts) => posts.blogId)
  posts: PostsSaEntity[];
}
