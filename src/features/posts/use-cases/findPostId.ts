import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsService } from '../api/posts.service';
import { NotFoundException } from '@nestjs/common';
import { myStatusView } from '../../sa/models/posts.sa.models';

export class FindPostId {
  constructor(public readonly postId: string) {}
}

@QueryHandler(FindPostId)
export class FindPostIdHandler implements IQueryHandler<FindPostId> {
  constructor(private readonly postsService: PostsService) {}
  async execute(query: FindPostId) {
    const findPost = await this.postsService.getPostId(query.postId);
    if (!findPost) throw new NotFoundException();

    return {
      id: findPost.id,
      title: findPost.title,
      shortDescription: findPost.shortDescription,
      content: findPost.content,
      blogId: findPost.blogId,
      blogName: findPost.blogName,
      createdAt: findPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: myStatusView.None,
        newestLikes: [],
      },
    };
  }
}
