import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsSaEntity } from '../../sa/entity/posts.sa.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsSaEntity)
    private readonly postRepository: Repository<PostsSaEntity>,
  ) {}

  async getPostId(postId: string) {
    return await this.postRepository.findOneBy({ id: postId });
  }
}
