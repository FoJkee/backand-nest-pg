import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { UserEntity } from '../features/user/entity/user.entity';
import { DeviceEntity } from '../features/device/entity/device.entity';
import { BlogsEntity } from '../features/sa/entity/blogsEntity';
import { PostsEntity } from '../features/sa/entity/posts.sa.entity';
import { CommentsEntity } from '../features/comments/entity/commentsEntity';
import { LikesEntity } from '../features/likes/entity/likes.entity';

const entity = [
  UserEntity,
  DeviceEntity,
  BlogsEntity,
  PostsEntity,
  CommentsEntity,
  LikesEntity,
];

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 4050,
      username: 'postgres',
      password: '2051',
      database: 'hw',
      entities: [...entity],
    };
  }
}
