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
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => PostsEntity, (post) => post.comments)
  @JoinColumn()
  postId: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn()
  userLogin: string;

  @Column()
  createdAt: string;

  @Column()
  likesCount: number;

  @Column()
  disLikesCount: number;

  @Column()
  status: myStatusView;

  @OneToMany(() => LikesEntity, (like) => like.commentId)
  likes: LikesEntity[];
}
