import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BlogQueryDto, CreateBlogsSaDto } from '../dto/blogs.sa.dto';
import { CreateSaBlogs } from '../use-cases/createSaBlogs';
import { BlogsSaService } from './blogs.sa.service';
import { GetSaBlogs } from '../use-cases/getSaBlogs';

@Controller('sa')
export class BlogsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly blogsSaService: BlogsSaService,
  ) {}

  @Post('blogs')
  @HttpCode(201)
  async createSaBlogs(@Body() createBlogsSaDto: CreateBlogsSaDto) {
    return this.commandBus.execute(new CreateSaBlogs(createBlogsSaDto));
  }

  @Get('blogs')
  @HttpCode(200)
  async getSaBlogs(@Query() blogQueryDto: BlogQueryDto) {
    return this.queryBus.execute(new GetSaBlogs(blogQueryDto));
  }
}
