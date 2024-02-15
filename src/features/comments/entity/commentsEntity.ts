import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { PostsEntity } from '../../sa/entity/posts.sa.entity';
import { myStatusView } from '../../sa/models/posts.sa.models';
import { LikesEntity } from '../../likes/entity/likes.entity';

@Entity({ name: 'comments' })
export class CommentsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'content' })
  content: string;

  @ManyToOne(() => PostsEntity, (post) => post.comments)
  @JoinColumn({ name: 'postid' })
  postId: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userlogin' })
  userLogin: string;

  @Column({ type: 'varchar', name: 'createdat' })
  createdAt: string;

  @Column({ type: 'integer', name: 'likescount' })
  likesCount: number;

  @Column({ type: 'integer', name: 'dislikescount' })
  disLikesCount: number;

  @Column({
    type: 'varchar',
    enum: myStatusView,
    name: 'status',
    default: myStatusView.None,
  })
  status: string;

  @OneToMany(() => LikesEntity, (like) => like.commentId)
  likes: LikesEntity[];
}
