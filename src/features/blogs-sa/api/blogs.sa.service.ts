import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { BlogViewModels } from '../models/blogs.sa.models';
import { BlogsSaEntity } from '../entity/blogs.sa.entity';
import { BlogQueryDto } from '../dto/blogs.sa.dto';
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
  ): Promise<PaginationView<BlogsSaEntity[]>> {
    const searchNameTerm = blogQueryDto.searchNameTerm.toString();

    const pageSkip = +blogQueryDto.pageSize * (+blogQueryDto.pageNumber - 1);

    const where: FindManyOptions<BlogsSaEntity>['where'] = [
      {
        name: ILike(`%${searchNameTerm}%`),
      },
    ];

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
      items: blogs.map(
        (el) =>
          ({
            id: el.id,
            name: el.name,
            createdAt: el.createdAt,
          }) as BlogsSaEntity,
      ),
    };
  }
}
