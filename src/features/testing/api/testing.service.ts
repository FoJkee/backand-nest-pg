import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { DeviceEntity } from '../../device/entity/device.entity';
import { BlogsEntity } from '../../sa/entity/blogsEntity';
import { PostsEntity } from '../../sa/entity/posts.sa.entity';
import { CommentsEntity } from '../../comments/entity/commentsEntity';
import { LikesEntity } from '../../likes/entity/likes.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(BlogsEntity)
    private readonly blogsSaRepository: Repository<BlogsEntity>,
    @InjectRepository(PostsEntity)
    private readonly postsSaRepository: Repository<PostsEntity>,
    @InjectRepository(LikesEntity)
    private readonly likeRepository: Repository<LikesEntity>,
    @InjectRepository(CommentsEntity)
    private readonly repositoryComments: Repository<CommentsEntity>,
  ) {}

  async deleteAll(): Promise<boolean> {
    try {
      await this.userRepository.delete({});
      await this.deviceRepository.delete({});
      await this.blogsSaRepository.delete({});
      await this.postsSaRepository.delete({});
      await this.repositoryComments.delete({});
      await this.likeRepository.delete({});
      return true;
    } catch (e) {
      return false;
    }
  }
}
