import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { myStatusView } from '../../sa/models/posts.sa.models';
import { PostsService } from '../api/posts.service';

export class UpdatePostIdLike {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly status: myStatusView,
  ) {}
}

@CommandHandler(UpdatePostIdLike)
export class UpdatePostIdLikeHandler
  implements ICommandHandler<UpdatePostIdLike>
{
  constructor(private readonly postsService: PostsService) {}
  async execute(command: UpdatePostIdLike) {
    const findPost = await this.postsService.getPostId(command.postId);
    if (!findPost) return false;

    const result = await this.postsService.updateLikeStatus(
      command.postId,
      command.userId,
      command.status,
    );
    findPost.likesCount = result.likesCount;
    findPost.disLikesCount = result.disLikesCount;
  }
}
