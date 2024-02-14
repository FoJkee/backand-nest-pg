import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentDto } from '../../comments/dto/comments.dto';
import { PostsService } from '../api/posts.service';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { myStatusView } from '../../sa/models/posts.sa.models';
import { UserService } from '../../user/api/user.service';
import { CommentsService } from '../../comments/api/comments.service';

export class CreateCommentsForPost {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly commentDto: CommentDto,
  ) {}
}

@CommandHandler(CreateCommentsForPost)
export class CreateCommentsForPostHandler
  implements ICommandHandler<CreateCommentsForPost>
{
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
    private readonly commentsService: CommentsService,
  ) {}

  async execute(command: CreateCommentsForPost) {
    const findPost = await this.postsService.getPostId(command.postId);
    if (!findPost) throw new NotFoundException();

    const user = await this.userService.findUserId(command.userId);

    const newComment = {
      id: randomUUID(),
      postId: command.postId,
      content: command.commentDto.content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: myStatusView.None,
      },
    };

    await this.commentsService.createCommentsForPost(newComment);
    return newComment;
  }
}
