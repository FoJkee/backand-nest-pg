import { randomUUID } from 'crypto';
import { myStatusView } from '../../sa/models/posts.sa.models';

export class CommentViewModels {
  constructor(
    public id: string = randomUUID(),
    public postId: string,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string = new Date().toISOString(),
    public likesInfo: LikesInfo,
  ) {}
}

type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: myStatusView;
};

type CommentatorInfo = {
  userId: string;
  userLogin: string;
};
