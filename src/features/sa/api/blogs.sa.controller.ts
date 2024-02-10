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
import { CommandBus } from '@nestjs/cqrs';
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
import { UserId } from '../../../decorators/user.decorator';
import { BearerAuthUserId } from '../../../guards/bearer.auth';
@UseGuards(BearerAuthUserId)
@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsSaService: PostsSaService,
    private readonly blogsSaService: BlogsSaService,
  ) {}

  @Post()
  @HttpCode(201)
  async createSaBlog(
    @Body() createBlogsSaDto: CreateBlogsSaDto,
    @UserId() userId: string,
  ) {
    return await this.commandBus.execute(
      new CreateSaBlogs(createBlogsSaDto, userId),
    );
  }

  @Get()
  @HttpCode(200)
  async getSaBlogs(
    @Query() blogQueryDto: BlogQueryDto,
    @UserId() userId: string,
  ) {
    return await this.blogsSaService.getSaBlogs(blogQueryDto, userId);
  }

  @Delete(':blogId')
  @HttpCode(204)
  async deleteSaBlog(
    @Param('blogId') blogId: string,
    @UserId() userId: string,
  ) {
    return await this.commandBus.execute(new DeleteSaBlogs(blogId, userId));
  }

  @Put(':blogId')
  @HttpCode(204)
  async updateSaBlog(
    @Param('blogId') blogId: string,
    @Body() createBlogsSaDto: CreateBlogsSaDto,
    @UserId() userId: string,
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
    @UserId() userId: string,
  ) {
    return await this.commandBus.execute(
      new CreatePostSaBlogs(blogId, createPostForBlogsSaDto, userId),
    );
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async getPostSaBlog(
    @Query() postsForBlogQueryDto: PostsForBlogQueryDto,
    @Param('blogId') blogId: string,
    @UserId() userId: string,
  ) {
    return await this.postsSaService.getPostsForBlogs(
      postsForBlogQueryDto,
      blogId,
      userId,
    );
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePostsSaBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @UserId() userId: string,
    @Body() createPostForBlogsSaDto: CreatePostForBlogsSaDto,
  ) {
    return await this.commandBus.execute(
      new UpdatePostsSaBlog(blogId, postId, createPostForBlogsSaDto, userId),
    );
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePostsSaBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @UserId() userId: string,
  ) {
    return await this.commandBus.execute(
      new DeletePostsSaBlog(blogId, postId, userId),
    );
  }
}
