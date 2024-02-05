import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostViewModels } from '../models/posts.sa.models';
import { PostsSaEntity } from '../entity/posts.sa.entity';
import { PaginationView } from '../../../setting/pagination.model';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import {
  CreatePostForBlogsSaDto,
  PostsForBlogQueryDto,
} from '../dto/postsForBlog';

@Injectable()
export class PostsSaService {
  constructor(
    @InjectRepository(PostsSaEntity)
    private readonly postsSaRepository: Repository<PostsSaEntity>,
  ) {}

  async createSaPost(newPost: PostViewModels): Promise<PostsSaEntity> {
    return this.postsSaRepository.save(newPost);
  }

  async getPostsForBlogs(
    postsForBlogQueryDto: PostsForBlogQueryDto,
    blogId: string,
  ): Promise<PaginationView<PostsSaEntity[]>> {
    const pageSkip =
      postsForBlogQueryDto.pageSize * (postsForBlogQueryDto.pageNumber - 1);

    const where: FindManyOptions['where'] = { blogId };

    const [posts, totalCount] = await Promise.all([
      this.postsSaRepository.find({
        where,
        order: {
          [postsForBlogQueryDto.sortBy]:
            postsForBlogQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
        },
        take: +postsForBlogQueryDto.pageSize,
        skip: +pageSkip,
      }),
      this.postsSaRepository.count({ where }),
    ]);

    return {
      pagesCount: Math.ceil(totalCount / postsForBlogQueryDto.pageSize),
      page: postsForBlogQueryDto.pageNumber,
      pageSize: postsForBlogQueryDto.pageSize,
      totalCount: totalCount,
      items: posts,
    };
  }

  async findPostId(postId: string): Promise<PostsSaEntity> {
    return await this.postsSaRepository.findOneBy({ id: postId });
  }

  async updatePostsForBlog(
    postId: string,
    createPostForBlogsSaDto: CreatePostForBlogsSaDto,
  ) {
    return await this.postsSaRepository.update(
      { id: postId },
      {
        title: createPostForBlogsSaDto.title,
        content: createPostForBlogsSaDto.content,
        shortDescription: createPostForBlogsSaDto.shortDescription,
      },
    );
  }

  async deletePostsForBlogId(postId: string) {
    return await this.postsSaRepository.delete({ id: postId });
  }
}
