import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { DeviceEntity } from '../../device/entity/device.entity';
import { BlogsSaEntity } from '../../sa/entity/blogs.sa.entity';
import { PostsSaEntity } from '../../sa/entity/posts.sa.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(BlogsSaEntity)
    private readonly blogsSaRepository: Repository<BlogsSaEntity>,
    @InjectRepository(PostsSaEntity)
    private readonly postsSaRepository: Repository<PostsSaEntity>,
  ) {}

  async deleteAll(): Promise<boolean> {
    try {
      await this.userRepository.delete({});
      await this.deviceRepository.delete({});
      await this.blogsSaRepository.delete({});
      await this.postsSaRepository.delete({});
      return true;
    } catch (e) {
      return false;
    }
  }
}
