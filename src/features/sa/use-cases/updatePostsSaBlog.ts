import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostForBlogsSaDto } from '../dto/postsForBlog';
import { BlogsSaService } from '../api/blogs.sa.service';
import { NotFoundException } from '@nestjs/common';
import { PostsSaService } from '../api/posts.sa.service';

export class UpdatePostsSaBlog {
  constructor(
    public readonly blogId: string,
    public readonly postId: string,
    public readonly createPostForBlogsSaDto: CreatePostForBlogsSaDto,
  ) {}
}

@CommandHandler(UpdatePostsSaBlog)
export class UpdatePostsSaBlogHandler
  implements ICommandHandler<UpdatePostsSaBlog>
{
  constructor(
    private readonly blogsSaService: BlogsSaService,
    private readonly postsSaService: PostsSaService,
  ) {}
  async execute(command: UpdatePostsSaBlog) {
    const findBlog = await this.blogsSaService.findBlogId(command.blogId);
    if (!findBlog) throw new NotFoundException();

    const findPost = await this.postsSaService.findPostId(command.postId);
    if (!findPost) throw new NotFoundException();

    return await this.postsSaService.updatePostsForBlog(
      command.postId,
      command.createPostForBlogsSaDto,
    );
  }
}
