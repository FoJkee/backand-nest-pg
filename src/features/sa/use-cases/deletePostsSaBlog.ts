import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSaService } from '../api/blogs.sa.service';
import { PostsSaService } from '../api/posts.sa.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeletePostsSaBlog {
  constructor(
    public readonly blogId: string,
    public readonly postId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeletePostsSaBlog)
export class DeletePostsSaBlogHandler
  implements ICommandHandler<DeletePostsSaBlog>
{
  constructor(
    private readonly blogsSaService: BlogsSaService,
    private readonly postsSaService: PostsSaService,
  ) {}
  async execute(command: DeletePostsSaBlog) {
    const findBlog = await this.blogsSaService.findBlogId(command.blogId);
    if (!findBlog) throw new NotFoundException();
    if (findBlog.userId !== command.userId) throw new ForbiddenException();
    const findPost = await this.postsSaService.findPostId(command.postId);
    if (!findPost) throw new NotFoundException();
    if (findPost.blogId !== command.blogId)
      return await this.postsSaService.deletePostsForBlogId(command.postId);
  }
}
