import { CreateBlogsSaDto } from '../dto/blogs.sa.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSaService } from '../api/blogs.sa.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UpdateSaBlogs {
  constructor(
    public readonly blogId: string,
    public readonly createBlogsSaDto: CreateBlogsSaDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateSaBlogs)
export class UpdateSaBlogsHandler implements ICommandHandler<UpdateSaBlogs> {
  constructor(private readonly blogsSaService: BlogsSaService) {}

  async execute(command: UpdateSaBlogs) {
    const findBlog = await this.blogsSaService.findBlogId(command.blogId);
    if (!findBlog) throw new NotFoundException();

    if (findBlog.userId !== command.userId) throw new ForbiddenException();

    return await this.blogsSaService.updateBlogId(
      command.blogId,
      command.createBlogsSaDto,
    );
  }
}
