import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentDto, CommentQueryDto } from '../dto/comments.dto';
import { CommentsEntity } from '../entity/commentsEntity';
import { CommentViewModels } from '../models/comment.models';
import { myStatusView } from '../../sa/models/posts.sa.models';
import { LikesEntity } from '../../likes/entity/likes.entity';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { UserService } from '../../user/api/user.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    @InjectRepository(LikesEntity)
    private readonly likeRepository: Repository<LikesEntity>,
    private readonly userService: UserService,
  ) {}

  async createCommentsForPost(
    newComment: CommentViewModels,
  ): Promise<CommentsEntity> {
    return await this.commentsRepository.save(newComment);
  }

  async getCommentsForPost(
    commentQueryDto: CommentQueryDto,
    postId: string,
    userId: string,
  ) {
    const user = await this.userService.findUserId(userId);

    const pageSkip =
      commentQueryDto.pageSize * (commentQueryDto.pageNumber - 1);

    const where: FindManyOptions<CommentsEntity>['where'] = { postId }[0];

    const [comment, totalCount] = await Promise.all([
      this.commentsRepository.find({
        where,
        order: {
          [commentQueryDto.sortBy]:
            commentQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
        },
        take: +commentQueryDto.pageSize,
        skip: +pageSkip,
      }),
      this.commentsRepository.count({ where }),
    ]);

    // const result = await Promise.all(
    //   comment.map(async (com) => {
    //     let myStatus = myStatusView.None;
    //     if (user.id) {
    //       const findUserLikeStatus = await this.likeRepository.findOneBy({
    //         commentId: com.id,
    //         userId: user.id,
    //       });
    //       if (findUserLikeStatus) {
    //         myStatus = com.likes
    //           ? findUserLikeStatus.status
    //           : myStatusView.None;
    //       }
    //     }
    //     return { ...com, status: myStatus }[0];
    //   }),
    // );

    return {
      pagesCount: Math.ceil(totalCount / commentQueryDto.pageSize),
      page: commentQueryDto.pageNumber,
      pageSize: commentQueryDto.pageSize,
      totalCount: totalCount,
      items: comment.map((el) => ({
        id: el.id,
        content: el.content,
        commentatorInfo: {
          userId: user.id,
          userLogin: user.login,
        },
        createdAt: el.createdAt,
        likesInfo: {
          myStatus: el.likes,
        },
      })),
    };
  }

  async getCommentsId(commentId: string) {
    return await this.commentsRepository.findOneBy({ id: commentId });
  }

  async deleteCommentId(commentId: string) {
    return await this.commentsRepository.delete({ id: commentId });
  }

  async updateCommentId(commentId: string, commentDto: CommentDto) {
    return await this.commentsRepository.update(
      { id: commentId },
      { content: commentDto.content },
    );
  }

  // async updateCommentIdLikeStatus(
  //   commentId: string,
  //   userId: string,
  //   status: myStatusView,
  // ) {
  //   const findComment = await this.getCommentsId(commentId);
  //
  //   await this.likeRepository.update(
  //     { commentId, userId },
  //     { status, createdAt: new Date().toISOString },
  //   );
  //
  //   const [likesCount, disLikesCount] = await Promise.all([
  //     this.likeRepository.countBy({ commentId, status: myStatusView.Like }),
  //     this.likeRepository.countBy({ commentId, status: myStatusView.DisLike }),
  //   ]);
  //
  //   findComment.disLikesCount = disLikesCount;
  //   findComment.likesCount = likesCount;
  //
  //   await this.commentsRepository.update({ id: findComment.id }, { status });
  //   return;
  // }
}
