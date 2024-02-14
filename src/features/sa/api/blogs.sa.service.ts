import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { BlogsEntity } from '../entity/blogsEntity';
import { BlogQueryDto, CreateBlogsSaDto } from '../dto/blogs.sa.dto';
import { PaginationView } from '../../../setting/pagination.model';
import { BlogViewModels } from '../models/blogs.sa.models';

@Injectable()
export class BlogsSaService {
  constructor(
    @InjectRepository(BlogsEntity)
    private readonly blogsSaRepository: Repository<BlogsEntity>,
  ) {}

  async createSaBlogs(newBlog: BlogViewModels): Promise<BlogsEntity> {
    return this.blogsSaRepository.save(newBlog);
  }

  async getSaBlogs(
    blogQueryDto: BlogQueryDto,
  ): Promise<PaginationView<BlogsEntity[]>> {
    const searchNameTerm = blogQueryDto.searchNameTerm
      ? blogQueryDto.searchNameTerm.toString()
      : '';

    const pageSkip = blogQueryDto.pageSize * (blogQueryDto.pageNumber - 1);

    const where: FindManyOptions<BlogsEntity>['where'] = {
      name: ILike(`%${searchNameTerm}%`),
    }[0];

    const [blogs, totalCount] = await Promise.all([
      this.blogsSaRepository.find({
        where,
        order: {
          [blogQueryDto.sortBy]:
            blogQueryDto.sortDirection === 'asc' ? 'asc' : 'desc',
        },
        take: +blogQueryDto.pageSize,
        skip: +pageSkip,
      }),
      this.blogsSaRepository.count({ where }),
    ]);

    return {
      pagesCount: Math.ceil(totalCount / blogQueryDto.pageSize),
      page: blogQueryDto.pageNumber,
      pageSize: blogQueryDto.pageSize,
      totalCount: totalCount,
      items: blogs,
    };
  }

  async findBlogId(blogId: string): Promise<BlogsEntity> {
    return this.blogsSaRepository.findOneBy({ id: blogId });
  }

  async deleteBlogId(blogId: string) {
    return this.blogsSaRepository.delete({ id: blogId });
  }

  async updateBlogId(blogId: string, createBlogsSaDto: CreateBlogsSaDto) {
    return await this.blogsSaRepository.update(
      { id: blogId },
      {
        name: createBlogsSaDto.name,
        description: createBlogsSaDto.description,
        websiteUrl: createBlogsSaDto.websiteUrl,
      },
    );
  }
}
