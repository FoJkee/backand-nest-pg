import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from '../../sa/entity/posts.sa.entity';
import { PostsForBlogQueryDto } from '../../sa/dto/postsForBlog';
import { PaginationView } from '../../../setting/pagination.model';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { PostQueryDto } from '../dto/posts.dto';
import { LikesEntity } from '../../likes/entity/likes.entity';
import { myStatusView, PostViewModels } from '../../sa/models/posts.sa.models';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postRepository: Repository<PostsEntity>,
    @InjectRepository(LikesEntity)
    private readonly likeRepository: Repository<LikesEntity>,
  ) {}

  async getPostId(postId: string): Promise<PostsEntity> {
    return await this.postRepository.findOneBy({ id: postId });
  }

  async getPosts(
    postQueryDto: PostQueryDto,
  ): Promise<PaginationView<PostViewModels[]>> {
    const pageSkip = postQueryDto.pageSize * (postQueryDto.pageNumber - 1);

    const [posts, totalCount] = await Promise.all([
      this.postRepository.find({
        order: {
          [postQueryDto.sortBy]:
            postQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
        },
        take: +postQueryDto.pageSize,
        skip: +pageSkip,
      }),
      this.postRepository.count({}),
    ]);

    return {
      pagesCount: Math.ceil(totalCount / postQueryDto.pageSize),
      page: postQueryDto.pageNumber,
      pageSize: postQueryDto.pageSize,
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

  async getPostsForBlogs(
    postsForBlogQueryDto: PostsForBlogQueryDto,
    blogId: string,
  ): Promise<PaginationView<PostViewModels[]>> {
    const pageSkip =
      postsForBlogQueryDto.pageSize * (postsForBlogQueryDto.pageNumber - 1);

    const where: FindManyOptions<PostsEntity>['where'] = { blogId }[0];

    const [posts, totalCount] = await Promise.all([
      this.postRepository.find({
        where,
        order: {
          [postsForBlogQueryDto.sortBy]:
            postsForBlogQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
        },
        take: +postsForBlogQueryDto.pageSize,
        skip: +pageSkip,
      }),
      this.postRepository.count({ where }),
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

  async updateLikeStatus(postId: string, userId: string, status: myStatusView) {
    const findPost = await this.getPostId(postId);

    await this.likeRepository.update(
      { postId, userId },
      { status, createdAt: new Date().toISOString },
    );

    const [likesCount, disLikesCount] = await Promise.all([
      this.likeRepository.countBy({ postId, status: myStatusView.Like }),
      this.likeRepository.countBy({ postId, status: myStatusView.DisLike }),
    ]);

    findPost.disLikesCount = disLikesCount;
    findPost.likesCount = likesCount;

    await this.postRepository.update({ id: postId }, { status });

    return { likesCount, disLikesCount };
  }
}
