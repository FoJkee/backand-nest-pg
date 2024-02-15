import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentDto, CommentQueryDto } from '../dto/comments.dto';
import { PaginationView } from '../../../setting/pagination.model';
import { CommentsEntity } from '../entity/commentsEntity';
import { CommentViewModels } from '../models/comment.models';
import { myStatusView } from '../../sa/models/posts.sa.models';
import { LikesEntity } from '../../likes/entity/likes.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly repositoryComments: Repository<CommentsEntity>,
    @InjectRepository(LikesEntity)
    private readonly likeRepository: Repository<LikesEntity>,
  ) {}

  async createCommentsForPost(
    newComment: CommentViewModels,
  ): Promise<CommentsEntity> {
    return await this.repositoryComments.save(newComment);
  }

  async getCommentsForPost(
    commentQueryDto: CommentQueryDto,
  ): Promise<PaginationView<CommentsEntity[]>> {
    const pageSkip =
      commentQueryDto.pageSize * (commentQueryDto.pageNumber - 1);

    const [comment, totalCount] = await Promise.all([
      this.repositoryComments.find({
        order: {
          [commentQueryDto.sortBy]:
            commentQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
        },
        take: +commentQueryDto.pageSize,
        skip: +pageSkip,
      }),
      this.repositoryComments.count({}),
    ]);

    return {
      pagesCount: Math.ceil(totalCount / commentQueryDto.pageSize),
      page: commentQueryDto.pageNumber,
      pageSize: commentQueryDto.pageSize,
      totalCount: totalCount,
      items: comment,
    };
  }

  async getCommentsId(commentId: string) {
    return await this.repositoryComments.findOneBy({ id: commentId });
  }

  async deleteCommentId(commentId: string) {
    return await this.repositoryComments.delete({ id: commentId });
  }

  async updateCommentId(commentId: string, commentDto: CommentDto) {
    return await this.repositoryComments.update(
      { id: commentId },
      { content: commentDto.content },
    );
  }

  async updateCommentIdLikeStatus(
    commentId: string,
    userId: string,
    status: myStatusView,
  ) {
    const findComment = await this.getCommentsId(commentId);

    await this.likeRepository.update(
      { commentId, userId },
      { status, createdAt: new Date().toISOString },
    );

    const [likesCount, disLikesCount] = await Promise.all([
      this.likeRepository.countBy({ commentId, status: myStatusView.Like }),
      this.likeRepository.countBy({ commentId, status: myStatusView.DisLike }),
    ]);

    findComment.disLikesCount = disLikesCount;
    findComment.likesCount = likesCount;

    await this.repositoryComments.update({ id: findComment.id }, { status });
    return;
  }
}
