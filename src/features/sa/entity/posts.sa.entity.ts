import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentsEntity } from '../../comments/entity/commentsEntity';
import { myStatusView } from '../models/posts.sa.models';
import { LikesEntity } from '../../likes/entity/likes.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'posts' })
export class PostsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({ type: 'varchar', name: 'shortdescription' })
  shortDescription: string;

  @Column({ type: 'varchar', name: 'content' })
  content: string;

  // @ManyToOne(() => BlogsEntity, (blog) => blog.posts)
  // @JoinColumn({ name: 'blogid' })
  // blogId: string;

  @Column({ type: 'uuid', name: 'blogid' })
  blogId: string;

  @Column({ type: 'varchar', name: 'blogname' })
  blogName: string;

  @Column({ type: 'varchar', name: 'createdat' })
  createdAt: string;

  @Column({ type: 'integer', name: 'likescount' })
  likesCount: number;

  @Column({ type: 'integer', name: 'dislikescount' })
  disLikesCount: number;

  @Column({ enum: myStatusView })
  status: myStatusView;

  @Column({ type: 'varchar', name: 'addedat' })
  addedAt: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userid' })
  userId: string;

  @OneToMany(() => CommentsEntity, (comment) => comment.postId)
  comments: CommentsEntity[];

  @OneToMany(() => LikesEntity, (like) => like.postId)
  likes: LikesEntity[];
}
