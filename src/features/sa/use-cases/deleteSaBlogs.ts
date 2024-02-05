import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSaService } from '../api/blogs.sa.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteSaBlogs {
  constructor(
    public readonly blogId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteSaBlogs)
export class DeleteSaBlogsHandler implements ICommandHandler<DeleteSaBlogs> {
  constructor(private readonly blogsSaService: BlogsSaService) {}
  async execute(command: DeleteSaBlogs): Promise<any> {
    const findBlog = await this.blogsSaService.findBlogId(command.blogId);
    if (!findBlog) throw new NotFoundException();

    if (findBlog.userId !== command.userId) throw new ForbiddenException();
    return this.blogsSaService.deleteBlogId(command.blogId);
  }
}
