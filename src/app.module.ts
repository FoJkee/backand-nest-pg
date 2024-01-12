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

const modules = [UserModule, TestingModule, AuthModule];

const imports = [
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
  CqrsModule,
];

@Module({
  imports: [...imports, ...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
