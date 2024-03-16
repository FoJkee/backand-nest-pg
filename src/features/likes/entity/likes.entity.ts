import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { myStatusView } from '../../sa/models/posts.sa.models';
import { PostsEntity } from '../../sa/entity/posts.sa.entity';
import { CommentsEntity } from '../../comments/entity/commentsEntity';

@Entity({})
export class LikesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'status', enum: myStatusView })
  status: string;

  @Column({ type: 'varchar' })
  createdAt: string;

  @ManyToOne(() => UserEntity, (user) => user.likes)
  @JoinColumn()
  userId: string;

  @ManyToOne(() => PostsEntity, (post) => post.likes)
  @JoinColumn()
  postId: string;

  @ManyToOne(() => CommentsEntity, (comment) => comment.likes)
  @JoinColumn({ name: 'commentid' })
  commentId: string;
}
