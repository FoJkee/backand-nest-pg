import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

const modules = [UserModule];

const imports = [
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
];

@Module({
  imports: [...imports, ...modules],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
