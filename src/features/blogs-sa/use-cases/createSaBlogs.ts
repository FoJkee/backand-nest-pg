import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogsSaDto } from '../dto/blogs.sa.dto';
import { randomUUID } from 'crypto';
import { BlogsSaService } from '../api/blogs.sa.service';

export class CreateSaBlogs {
  constructor(public readonly createBlogsSaDto: CreateBlogsSaDto) {}
}

@CommandHandler(CreateSaBlogs)
export class CreateSaBlogsHandler implements ICommandHandler<CreateSaBlogs> {
  constructor(private readonly blogsSaService: BlogsSaService) {}
  async execute(command: CreateSaBlogs) {
    const newBlog = {
      id: randomUUID(),
      name: command.createBlogsSaDto.name,
      description: command.createBlogsSaDto.description,
      websiteUrl: command.createBlogsSaDto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    await this.blogsSaService.createSaBlogs(newBlog);
    return newBlog;
  }
}
