import { CreateBlogsSaDto } from '../dto/blogs.sa.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSaService } from '../api/blogs.sa.service';
import { NotFoundException } from '@nestjs/common';

export class UpdateSaBlogs {
  constructor(
    public readonly blogId: string,
    public readonly createBlogsSaDto: CreateBlogsSaDto,
  ) {}
}

@CommandHandler(UpdateSaBlogs)
export class UpdateSaBlogsHandler implements ICommandHandler<UpdateSaBlogs> {
  constructor(private readonly blogsSaService: BlogsSaService) {}

  async execute(command: UpdateSaBlogs) {
    const findBlog = await this.blogsSaService.findBlogId(command.blogId);
    if (!findBlog) throw new NotFoundException();

    // if (findBlog.userId) throw new ForbiddenException();
    return await this.blogsSaService.updateBlogId(
      command.blogId,
      command.createBlogsSaDto,
    );
  }
}
