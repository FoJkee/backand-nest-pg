import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { myStatusView, PostViewModels } from '../models/posts.sa.models';
import { PostsEntity } from '../entity/posts.sa.entity';
import { PaginationView } from '../../../setting/pagination.model';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import {
  CreatePostForBlogsSaDto,
  PostsForBlogQueryDto,
} from '../dto/postsForBlog';

@Injectable()
export class PostsSaService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsSaRepository: Repository<PostsEntity>,
  ) {}

  async createSaPost(newPost: PostViewModels): Promise<PostsEntity> {
    return this.postsSaRepository.save(newPost);
  }

  async getPostsForBlogs(
    postsForBlogQueryDto: PostsForBlogQueryDto,
    blogId: string,
  ): Promise<PaginationView<PostViewModels[]>> {
    const pageSkip =
      postsForBlogQueryDto.pageSize * (postsForBlogQueryDto.pageNumber - 1);

    const where: FindManyOptions<PostsEntity>['where'] = { blogId }[0];

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
      items: posts.map((el) => ({
        id: el.id,
        title: el.title,
        shortDescription: el.shortDescription,
        content: el.content,
        blogId: el.blogId,
        blogName: el.blogName,
        createdAt: el.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: myStatusView.None,
          newestLikes: [],
        },
      })),
    };
  }

  async findPostId(postId: string): Promise<PostsEntity> {
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
