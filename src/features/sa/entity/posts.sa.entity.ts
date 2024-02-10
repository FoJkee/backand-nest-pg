import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogsEntity } from './blogsEntity';

@Entity({ name: 'posts' })
export class PostsSaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({ type: 'varchar', name: 'shortdescription' })
  shortDescription: string;

  @Column({ type: 'varchar', name: 'content' })
  content: string;

  @ManyToOne(() => BlogsEntity, (blog) => blog.posts)
  @JoinColumn({ name: 'blogid' })
  blogId: string;

  @Column({ type: 'varchar', name: 'blogname' })
  blogName: string;

  @Column({ type: 'varchar', name: 'createdat' })
  createdAt: string;
}
