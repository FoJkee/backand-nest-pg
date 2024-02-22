import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsService } from '../api/comments.service';
import { NotFoundException } from '@nestjs/common';

export class FindComment {
  constructor(public readonly commentId: string) {}
}

@QueryHandler(FindComment)
export class FindCommentHandler implements IQueryHandler<FindComment> {
  constructor(private readonly commentsService: CommentsService) {}

  async execute(query: FindComment): Promise<any> {
    const findComment = await this.commentsService.getCommentsId(
      query.commentId,
    );
    if (!findComment) throw new NotFoundException();
    return findComment;
  }
}
