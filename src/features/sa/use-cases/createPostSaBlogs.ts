import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSaService } from '../api/blogs.sa.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { myStatusView } from '../models/posts.sa.models';
import { PostsSaService } from '../api/posts.sa.service';
import { CreatePostForBlogsSaDto } from '../dto/postsForBlog';

export class CreatePostSaBlogs {
  constructor(
    public readonly blogId: string,
    public readonly createPostForBlogsSaDto: CreatePostForBlogsSaDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreatePostSaBlogs)
export class CreatePostSaBlogsHandler
  implements ICommandHandler<CreatePostSaBlogs>
{
  constructor(
    private readonly blogsSaService: BlogsSaService,
    private readonly postsSaService: PostsSaService,
  ) {}

  async execute(command: CreatePostSaBlogs) {
    const findBlog = await this.blogsSaService.findBlogId(command.blogId);
    if (!findBlog) throw new NotFoundException();

    if (findBlog.userId !== command.userId) throw new ForbiddenException();

    const newPost = {
      id: randomUUID(),
      title: command.createPostForBlogsSaDto.title,
      shortDescription: command.createPostForBlogsSaDto.shortDescription,
      content: command.createPostForBlogsSaDto.content,
      blogId: command.blogId,
      blogName: findBlog.name,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: myStatusView.None,
        newestLikes: [],
      },
    };
    await this.postsSaService.createSaPost(newPost);
    return newPost;
  }
}
