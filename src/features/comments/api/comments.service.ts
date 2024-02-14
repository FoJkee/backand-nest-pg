import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentQueryDto } from '../dto/comments.dto';
import { PaginationView } from '../../../setting/pagination.model';
import { CommentsEntity } from '../entity/commentsEntity';
import { CommentViewModels } from '../models/comment.models';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly repositoryComments: Repository<CommentsEntity>,
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
}
