import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSaService } from '../api/blogs.sa.service';
import { NotFoundException } from '@nestjs/common';

export class DeleteSaBlogs {
  constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteSaBlogs)
export class DeleteSaBlogsHandler implements ICommandHandler<DeleteSaBlogs> {
  constructor(private readonly blogsSaService: BlogsSaService) {}
  async execute(command: DeleteSaBlogs): Promise<any> {
    const findBlog = await this.blogsSaService.findBlogId(command.blogId);
    if (!findBlog) throw new NotFoundException();

    return this.blogsSaService.deleteBlogId(command.blogId);
  }
}
