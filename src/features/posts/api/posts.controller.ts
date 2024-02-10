import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindPostId } from '../use-cases/findPostId';

@Controller('posts')
export class PostsController {
  constructor(private readonly queryBus: QueryBus) {}

  async getPosts() {}

  @Get(':postId')
  async getPostId(@Param('postId') postId: string) {
    return await this.queryBus.execute(new FindPostId(postId));
  }
}
