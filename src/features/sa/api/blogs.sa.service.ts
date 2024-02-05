import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { BlogViewModels } from '../models/blogs.sa.models';
import { BlogsSaEntity } from '../entity/blogs.sa.entity';
import { BlogQueryDto, CreateBlogsSaDto } from '../dto/blogs.sa.dto';
import { PaginationView } from '../../../setting/pagination.model';

@Injectable()
export class BlogsSaService {
  constructor(
    @InjectRepository(BlogsSaEntity)
    private readonly blogsSaRepository: Repository<BlogsSaEntity>,
  ) {}

  async createSaBlogs(newBlog: BlogViewModels): Promise<BlogsSaEntity> {
    return this.blogsSaRepository.save(newBlog);
  }

  async getSaBlogs(
    blogQueryDto: BlogQueryDto,
    userId: string,
  ): Promise<PaginationView<BlogsSaEntity[]>> {
    const searchNameTerm = blogQueryDto.searchNameTerm ?? '';

    const pageSkip = +blogQueryDto.pageSize * (+blogQueryDto.pageNumber - 1);

    const where: FindManyOptions<BlogsSaEntity>['where'] = {
      name: ILike(`%${searchNameTerm}%`),
      userId,
    };

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
  async findBlogId(blogId: string): Promise<BlogsSaEntity> {
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
