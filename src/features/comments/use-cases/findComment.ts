import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsService } from '../api/comments.service';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/api/user.service';
import { myStatusView } from '../../sa/models/posts.sa.models';

export class FindComment {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
  ) {}
}

@QueryHandler(FindComment)
export class FindCommentHandler implements IQueryHandler<FindComment> {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly userService: UserService,
  ) {}

  async execute(query: FindComment): Promise<any> {
    const findComment = await this.commentsService.getCommentsId(
      query.commentId,
    );
    const user = await this.userService.findUserId(query.userId);
    if (!findComment) throw new NotFoundException();

    return {
      id: findComment.id,
      content: findComment.content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: findComment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: myStatusView.None,
      },
    };
  }
}
