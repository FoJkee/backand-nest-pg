import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteCommentId } from '../use-cases/deleteCommentId';
import { BearerAuthUserId } from '../../../guards/bearer.auth';
import { UserId } from '../../../decorators/user.decorator';
import { CommentDto } from '../dto/comments.dto';
import { UpdateCommentId } from '../use-cases/updateCommentId';
import { LikesDto } from '../../likes/dto/likes.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':commentId')
  @HttpCode(200)
  async getCommentId(@Param('commentId') commentId: string) {
    return await this.commentsService.getCommentsId(commentId);
  }

  @Delete(':commentId')
  @UseGuards(BearerAuthUserId)
  @HttpCode(204)
  async deleteCommentId(
    @Param('commentId') commentId: string,
    @UserId() userId: string,
  ) {
    return this.commandBus.execute(new DeleteCommentId(commentId, userId));
  }

  @Put(':commentId')
  @UseGuards(BearerAuthUserId)
  @HttpCode(204)
  async updateCommentId(
    @Param('commentId') commentId: string,
    @UserId() userId: string,
    @Body() commentDto: CommentDto,
  ) {
    return await this.commandBus.execute(
      new UpdateCommentId(commentId, userId, commentDto),
    );
  }

  @Put(':commentId/like-status')
  @UseGuards(BearerAuthUserId)
  @HttpCode(204)
  async updateCommentIdLikeStatus(
    @Param('commentId') commentId: string,
    @UserId() userId: string,
    @Body() likesDto: LikesDto,
  ) {
    return await this.commentsService.updateCommentIdLikeStatus(
      commentId,
      userId,
      likesDto.likeStatus,
    );
  }
}
