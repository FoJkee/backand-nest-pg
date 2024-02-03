import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationModelsView } from '../../../setting/pagination.model';
import { PostsSaService } from '../api/posts.sa.service';
import { PostsForBlogQueryDto } from '../dto/postsForBlog';

export class GetPostSaBlogs {
  constructor(
    public readonly postsForBlogQueryDto: PostsForBlogQueryDto,
    public readonly blogId: string,
  ) {}
}

@QueryHandler(GetPostSaBlogs)
export class GetPostSaBlogsHandler implements IQueryHandler<GetPostSaBlogs> {
  constructor(private readonly postsSaService: PostsSaService) {}
  async execute(query: GetPostSaBlogs) {
    const paginationPostForBlog: PaginationModelsView = {
      pageNumber: query.postsForBlogQueryDto.pageNumber || 1,
      pageSize: query.postsForBlogQueryDto.pageSize || 10,
      sortBy: query.postsForBlogQueryDto.sortBy || 'createdAt',
      sortDirection:
        query.postsForBlogQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
    };
    return await this.postsSaService.getPostsForBlogs(
      paginationPostForBlog,
      query.blogId,
    );
  }
}
