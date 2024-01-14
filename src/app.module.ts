import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { UserModule } from './features/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TestingModule } from './features/testing/testing.module';
import { AuthModule } from './features/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UserFindEmailValidator,
  UserFindLoginValidator,
} from './features/user/setting/user.validator';

const modules = [CqrsModule, UserModule, TestingModule, AuthModule];
const setting = [UserFindEmailValidator, UserFindLoginValidator];

const imports = [
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
];

@Module({
  imports: [...imports, ...modules],
  controllers: [AppController],
  providers: [AppService, ...setting],
})
export class AppModule {}
