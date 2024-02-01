import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { UserEntity } from '../features/user/entity/user.entity';
import { DeviceEntity } from '../features/device/entity/device.entity';
import { BlogsSaEntity } from '../features/blogs-sa/entity/blogs.sa.entity';

const entity = [UserEntity, DeviceEntity, BlogsSaEntity];

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
