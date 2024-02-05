import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BlogQueryDto, CreateBlogsSaDto } from '../dto/blogs.sa.dto';
import { CreateSaBlogs } from '../use-cases/createSaBlogs';
import { DeleteSaBlogs } from '../use-cases/deleteSaBlogs';
import { UpdateSaBlogs } from '../use-cases/updateSaBlogs';
import { CreatePostSaBlogs } from '../use-cases/createPostSaBlogs';
import {
  CreatePostForBlogsSaDto,
  PostsForBlogQueryDto,
} from '../dto/postsForBlog';
import { PostsSaService } from './posts.sa.service';
import { BlogsSaService } from './blogs.sa.service';
import { UpdatePostsSaBlog } from '../use-cases/updatePostsSaBlog';
import { DeletePostsSaBlog } from '../use-cases/deletePostsSaBlog';
import { BasicAuthGuard } from '../../../guards/basic.auth';
import { User } from '../../../decorators/user.decorator';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly postsSaService: PostsSaService,
    private readonly blogsSaService: BlogsSaService,
  ) {}

  //userId - auth or basic?
  @Post()
  @HttpCode(201)
  async createSaBlog(
    @Body() createBlogsSaDto: CreateBlogsSaDto,
    @User() userId: string,
  ) {
    return await this.commandBus.execute(
      new CreateSaBlogs(createBlogsSaDto, userId),
    );
  }

  @Get()
  @HttpCode(200)
  async getSaBlogs(
    @Query() blogQueryDto: BlogQueryDto,
    @User() userId: string,
  ) {
    return await this.blogsSaService.getSaBlogs(blogQueryDto, userId);
  }

  @Delete(':blogId')
  @HttpCode(204)
  async deleteSaBlog(@Param('blogId') blogId: string, @User() userId: string) {
    return await this.commandBus.execute(new DeleteSaBlogs(blogId, userId));
  }

  @Put(':blogId')
  @HttpCode(204)
  async updateSaBlog(
    @Param('blogId') blogId: string,
    @Body() createBlogsSaDto: CreateBlogsSaDto,
    @User() userId: string,
  ) {
    return await this.commandBus.execute(
      new UpdateSaBlogs(blogId, createBlogsSaDto, userId),
    );
  }

  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostSaBlog(
    @Param('blogId') blogId: string,
    @Body() createPostForBlogsSaDto: CreatePostForBlogsSaDto,
  ) {
    return await this.commandBus.execute(
      new CreatePostSaBlogs(blogId, createPostForBlogsSaDto),
    );
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async getPostSaBlog(
    @Query() postsForBlogQueryDto: PostsForBlogQueryDto,
    @Param('blogId') blogId: string,
  ) {
    // return await this.queryBus.execute(
    //   new GetPostSaBlogs(postsForBlogQueryDto, blogId),
    // );
    return await this.postsSaService.getPostsForBlogs(
      postsForBlogQueryDto,
      blogId,
    );
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePostsSaBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() createPostForBlogsSaDto: CreatePostForBlogsSaDto,
  ) {
    return await this.commandBus.execute(
      new UpdatePostsSaBlog(blogId, postId, createPostForBlogsSaDto),
    );
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePostsSaBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    return await this.commandBus.execute(new DeletePostsSaBlog(blogId, postId));
  }
}
