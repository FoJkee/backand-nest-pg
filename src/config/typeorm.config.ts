import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as process from 'process';

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.HOST_POSTGRES,
      port: +process.env.PORT_POSTGRES,
      password: process.env.PASSWORD_POSTGRES,
      username: process.env.NAME_POSTGRES,
      entities: [],
      database: process.env.DATABASE_POSTGRES,
    };
  }
}
