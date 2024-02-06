import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { BlogsSaEntity } from '../../sa/entity/blogs.sa.entity';
import { BlogQueryDto } from '../../sa/dto/blogs.sa.dto';
import { PaginationView } from '../../../setting/pagination.model';

@Injectable()
export class BlogsService {
  @InjectRepository(BlogsSaEntity)
  private readonly blogsSaRepository: Repository<BlogsSaEntity>;

  async findBlogId(blogId: string) {
    return await this.blogsSaRepository.findOneBy({ id: blogId });
  }

  async getBlogs(
    blogQueryDto: BlogQueryDto,
  ): Promise<PaginationView<BlogsSaEntity[]>> {
    const searchNameTerm = blogQueryDto.searchNameTerm ?? '';

    const pageSkip = +blogQueryDto.pageSize * (+blogQueryDto.pageNumber - 1);

    const where: FindManyOptions<BlogsSaEntity>['where'] = {
      name: ILike(`%${searchNameTerm}%`),
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
}
