import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBlogsSaDto } from '../dto/blogs.sa.dto';
import { CreateSaBlogs } from '../use-cases/createSaBlogs';

@Controller('sa')
export class BlogsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('blogs')
  @HttpCode(201)
  async createSaBlogs(@Body() createBlogsSaDto: CreateBlogsSaDto) {
    return this.commandBus.execute(new CreateSaBlogs(createBlogsSaDto));
  }
}
