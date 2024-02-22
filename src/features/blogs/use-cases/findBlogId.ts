import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogsService } from '../api/blogs.service';

export class FindBlogId {
  constructor(public readonly blogId: string) {}
}

@QueryHandler(FindBlogId)
export class FindBlogIdHandler implements IQueryHandler<FindBlogId> {
  constructor(private readonly blogsService: BlogsService) {}
  async execute(query: FindBlogId) {
    const findBlogId = await this.blogsService.findBlogId(query.blogId);
    if (!findBlogId) throw new NotFoundException();
    return findBlogId;
  }
}
