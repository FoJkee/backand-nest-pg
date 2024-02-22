import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsService } from '../api/comments.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteCommentId {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteCommentId)
export class DeleteCommentIdHandler
  implements ICommandHandler<DeleteCommentId>
{
  constructor(private readonly commentsService: CommentsService) {}
  async execute(command: DeleteCommentId) {
    const findComment = await this.commentsService.getCommentsId(
      command.commentId,
    );
    if (!findComment) throw new NotFoundException();
    // if (findComment.userId !== command.userId) throw new ForbiddenException();
    return await this.commentsService.deleteCommentId(command.commentId);
  }
}
