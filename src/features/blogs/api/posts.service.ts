import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsSaEntity } from '../../sa/entity/posts.sa.entity';
import { Repository } from 'typeorm';
import { PostsForBlogQueryDto } from '../../sa/dto/postsForBlog';
import { PaginationView } from '../../../setting/pagination.model';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsSaEntity)
    private readonly postsRepository: Repository<PostsSaEntity>,
  ) {}

  async getPostsForBlogs(
    postsForBlogQueryDto: PostsForBlogQueryDto,
    blogId: string,
  ): Promise<PaginationView<PostsSaEntity[]>> {
    const pageSkip =
      postsForBlogQueryDto.pageSize * (postsForBlogQueryDto.pageNumber - 1);

    const where: FindManyOptions['where'] = { blogId };

    const [posts, totalCount] = await Promise.all([
      this.postsRepository.find({
        where,
        order: {
          [postsForBlogQueryDto.sortBy]:
            postsForBlogQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
        },
        take: +postsForBlogQueryDto.pageSize,
        skip: +pageSkip,
      }),
      this.postsRepository.count({ where }),
    ]);

    return {
      pagesCount: Math.ceil(totalCount / postsForBlogQueryDto.pageSize),
      page: postsForBlogQueryDto.pageNumber,
      pageSize: postsForBlogQueryDto.pageSize,
      totalCount: totalCount,
      items: posts,
    };
  }
}
