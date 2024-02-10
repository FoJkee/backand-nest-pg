import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsService } from '../api/posts.service';
import { NotFoundException } from '@nestjs/common';

export class FindPostId {
  constructor(public readonly postId: string) {}
}

@QueryHandler(FindPostId)
export class FindBlogIdHandler implements IQueryHandler<FindPostId> {
  constructor(private readonly postsService: PostsService) {}
  async execute(query: FindPostId) {
    const findPost = await this.postsService.getPostId(query.postId);
    if (!findPost) throw new NotFoundException();

    return findPost;
  }
}
