import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteCommentId } from '../use-cases/deleteCommentId';
import { BearerAuthUserId } from '../../../guards/bearer.auth';
import { UserId } from '../../../decorators/user.decorator';
import { CommentDto } from '../dto/comments.dto';
import { UpdateCommentId } from '../use-cases/updateCommentId';
import { LikesDto } from '../../likes/dto/likes.dto';
import { FindComment } from '../use-cases/findComment';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':commentId')
  @HttpCode(200)
  async getCommentId(
    @Param('commentId') commentId: string,
    @UserId() userId: string,
  ) {
    return await this.queryBus.execute(new FindComment(commentId, userId));
  }

  @Delete(':commentId')
  @UseGuards(BearerAuthUserId)
  @HttpCode(204)
  async deleteCommentId(
    @Param('commentId') commentId: string,
    @UserId() userId: string,
  ) {
    try {
      return this.commandBus.execute(new DeleteCommentId(commentId, userId));
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Put(':commentId')
  @UseGuards(BearerAuthUserId)
  @HttpCode(204)
  async updateCommentId(
    @Param('commentId') commentId: string,
    @UserId() userId: string,
    @Body() commentDto: CommentDto,
  ) {
    try {
      return await this.commandBus.execute(
        new UpdateCommentId(commentId, userId, commentDto),
      );
    } catch (e) {
      throw new NotFoundException();
    }
  }

  // @Put(':commentId/like-status')
  // @UseGuards(BearerAuthUserId)
  // @HttpCode(204)
  // async updateCommentIdLikeStatus(
  //   @Param('commentId') commentId: string,
  //   @UserId() userId: string,
  //   @Body() likesDto: LikesDto,
  // ) {
  //   return await this.commentsService.updateCommentIdLikeStatus(
  //     commentId,
  //     userId,
  //     likesDto.likeStatus,
  //   );
  // }
}
