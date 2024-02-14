import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindPostId } from '../use-cases/findPostId';
import { PostsService } from './posts.service';
import { PostQueryDto } from '../dto/posts.dto';
import { CreateCommentsForPost } from '../use-cases/createCommentsForPost';
import { BearerAuthUserId } from '../../../guards/bearer.auth';
import { UserId } from '../../../decorators/user.decorator';
import { CommentDto, CommentQueryDto } from '../../comments/dto/comments.dto';
import { CommentsService } from '../../comments/api/comments.service';
import { LikesDto } from '../../likes/dto/likes.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}
  @Get()
  @HttpCode(200)
  async getPosts(@Query() postQueryDto: PostQueryDto) {
    return await this.postsService.getPosts(postQueryDto);
  }

  @Get(':postId')
  @HttpCode(200)
  async getPostId(@Param('postId') postId: string) {
    return await this.queryBus.execute(new FindPostId(postId));
  }

  @Post(':postId/comments')
  @UseGuards(BearerAuthUserId)
  @HttpCode(201)
  async createCommentsForPost(
    @Param('postId') postId: string,
    @UserId() userId: string,
    @Body() commentDto: CommentDto,
  ) {
    return await this.commandBus.execute(
      new CreateCommentsForPost(postId, userId, commentDto),
    );
  }

  @Get(':postId/comments')
  @HttpCode(200)
  async getCommentsForPost(@Query() commentQueryDto: CommentQueryDto) {
    return await this.commentsService.getCommentsForPost(commentQueryDto);
  }

  @Put(':postId/like-status')
  @UseGuards(BearerAuthUserId)
  @HttpCode(204)
  async updatePostIdLikeStatus(
    @Param('postId') postId: string,
    @UserId() userId: string,
    @Body() likesDto: LikesDto,
  ) {
    return await this.postsService.updateLikeStatus(
      postId,
      userId,
      likesDto.likeStatus,
    );
  }
}
