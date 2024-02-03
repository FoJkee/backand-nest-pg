import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSaService } from '../api/blogs.sa.service';
import { PostsSaService } from '../api/posts.sa.service';
import { NotFoundException } from '@nestjs/common';

export class DeletePostsSaBlog {
  constructor(
    public readonly blogId: string,
    public readonly postId: string,
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
    const findPost = await this.postsSaService.findPostId(command.postId);
    if (!findPost) throw new NotFoundException();
    return await this.postsSaService.deletePostsForBlogId(command.postId);
  }
}
