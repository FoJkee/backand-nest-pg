import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindBlogId } from '../use-cases/findBlogId';
import { BlogQueryDto } from '../../sa/dto/blogs.sa.dto';
import { BlogsService } from './blogs.service';
import { PostsForBlogQueryDto } from '../../sa/dto/postsForBlog';
import { PostsService } from '../../posts/api/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
  ) {}

  @Get(':blogId')
  @HttpCode(200)
  async findBlogId(@Param('blogId') blogId: string) {
    return await this.queryBus.execute(new FindBlogId(blogId));
  }

  @Get()
  @HttpCode(200)
  async getBlogs(@Query() blogQueryDto: BlogQueryDto) {
    return await this.blogsService.getBlogs(blogQueryDto);
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async getPostSaBlog(
    @Query() postsForBlogQueryDto: PostsForBlogQueryDto,
    @Param('blogId') blogId: string,
  ) {
    return await this.postsService.getPostsForBlogs(
      postsForBlogQueryDto,
      blogId,
    );
  }
}
