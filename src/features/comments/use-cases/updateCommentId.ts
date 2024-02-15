import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentDto } from '../dto/comments.dto';
import { CommentsService } from '../api/comments.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UpdateCommentId {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly commentDto: CommentDto,
  ) {}
}

@CommandHandler(UpdateCommentId)
export class UpdateCommentIdHandler
  implements ICommandHandler<UpdateCommentId>
{
  constructor(private readonly commentsService: CommentsService) {}
  async execute(command: UpdateCommentId) {
    const findComment = await this.commentsService.getCommentsId(
      command.commentId,
    );
    if (!findComment) throw new NotFoundException();
    // if (findComment.userId !== command.userId) throw new ForbiddenException();
    return await this.commentsService.updateCommentId(
      command.commentId,
      command.commentDto,
    );
  }
}
