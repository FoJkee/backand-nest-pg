import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { UserEntity } from '../features/user/entity/user.entity';
import { DeviceEntity } from '../features/device/entity/device.entity';
import { BlogsEntity } from '../features/sa/entity/blogsEntity';
import { PostsSaEntity } from '../features/sa/entity/posts.sa.entity';

const entity = [UserEntity, DeviceEntity, BlogsEntity, PostsSaEntity];

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
