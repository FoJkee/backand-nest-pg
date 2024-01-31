import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogViewModels } from '../models/blogs.sa.models';
import { BlogsSaEntity } from '../entity/blogs.sa.entity';

@Injectable()
export class BlogsSaService {
  constructor(
    @InjectRepository(BlogsSaEntity)
    private readonly blogsSaRepository: Repository<BlogsSaEntity>,
  ) {}

  async createSaBlogs(newBlog: BlogViewModels): Promise<BlogsSaEntity> {
    return await this.blogsSaRepository.save(newBlog);
  }
}
