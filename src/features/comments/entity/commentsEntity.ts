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

  @Column({ type: 'varchar', name: 'userlogin' })
  userLogin: string;

  @Column({ type: 'varchar', name: 'createdat' })
  createdAt: string;

  @OneToMany(() => LikesEntity, (like) => like.commentId)
  likes: LikesEntity[];
}
