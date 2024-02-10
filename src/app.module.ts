import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UserFindEmailValidator,
  UserFindLoginValidator,
} from './features/user/setting/user.validator';
import { getConfig } from './setting/env.config';
import { DeviceController } from './features/device/api/device.controller';
import { RefreshTokensGuard } from './guards/refreshTokens.guard';
import { UserService } from './features/user/api/user.service';
import { AuthService } from './features/auth/infrastructure/auth.service';
import { DeviceService } from './features/device/api/device.service';
import { UserController } from './features/user/api/user.controller';
import { AuthController } from './features/auth/infrastructure/auth.controller';
import { TestingService } from './features/testing/api/testing.service';
import { TestingController } from './features/testing/api/testing.controller';
import { DeleteDeviceIdHandler } from './features/device/user-cases/delete.deviceid';
import { RegistrationHandler } from './features/auth/use-cases/registration';
import { RegistrationEmailResendingHandler } from './features/auth/use-cases/registrationEmailResending';
import { RegistrationConfirmationHandler } from './features/auth/use-cases/registrationConfirmation';
import { LoginHandler } from './features/auth/use-cases/login';
import { LogoutHandler } from './features/auth/use-cases/logout';
import { CreateUserHandler } from './features/user/use-cases/createUser';
import { GetAllUserHandler } from './features/user/use-cases/getAllUser';
import { DeleteUserHandler } from './features/user/use-cases/deleteUser';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './features/user/entity/user.entity';
import { DeviceEntity } from './features/device/entity/device.entity';
import { EmailService } from './setting/email.service';
import { AllDeviceUserIdHandler } from './features/device/user-cases/all.device.userId';
import { DeleteAllOtherSessionHandler } from './features/device/user-cases/deleteAllOtherSession';
import { AboutMeHandler } from './features/auth/use-cases/aboutMe';
import { RefreshTokenHandler } from './features/auth/use-cases/refreshToken';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfigService } from './config/throttler.config';
import { BlogsSaController } from './features/sa/api/blogs.sa.controller';
import { CreateSaBlogsHandler } from './features/sa/use-cases/createSaBlogs';
import { BlogsSaService } from './features/sa/api/blogs.sa.service';
import { BlogsEntity } from './features/sa/entity/blogsEntity';
import { DeleteSaBlogsHandler } from './features/sa/use-cases/deleteSaBlogs';
import { UpdateSaBlogsHandler } from './features/sa/use-cases/updateSaBlogs';
import { CreatePostSaBlogsHandler } from './features/sa/use-cases/createPostSaBlogs';
import { PostsSaEntity } from './features/sa/entity/posts.sa.entity';
import { PostsSaService } from './features/sa/api/posts.sa.service';
import { UpdatePostsSaBlogHandler } from './features/sa/use-cases/updatePostsSaBlog';
import { DeletePostsSaBlogHandler } from './features/sa/use-cases/deletePostsSaBlog';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsService } from './features/blogs/api/blogs.service';
import { PostsService } from './features/blogs/api/posts.service';
import { FindBlogIdHandler } from './features/blogs/use-cases/findBlogId';

const services = [
  UserService,
  AuthService,
  DeviceService,
  TestingService,
  JwtService,
  EmailService,
  BlogsSaService,
  PostsSaService,
  BlogsService,
  PostsService,
];

const controllers = [
  UserController,
  AuthController,
  DeviceController,
  TestingController,
  BlogsSaController,
  BlogsController,
];

const handlers = [
  DeleteDeviceIdHandler,
  RegistrationHandler,
  RegistrationEmailResendingHandler,
  RegistrationConfirmationHandler,
  LoginHandler,
  LogoutHandler,
  CreateUserHandler,
  GetAllUserHandler,
  DeleteUserHandler,
  AllDeviceUserIdHandler,
  DeleteAllOtherSessionHandler,
  AboutMeHandler,
  RefreshTokenHandler,
  CreateSaBlogsHandler,
  DeleteSaBlogsHandler,
  UpdateSaBlogsHandler,
  CreatePostSaBlogsHandler,
  UpdatePostsSaBlogHandler,
  DeletePostsSaBlogHandler,
  FindBlogIdHandler,
];

// const entity = [UserEntity, DeviceEntity];

const validators = [UserFindEmailValidator, UserFindLoginValidator];
const guards = [RefreshTokensGuard];

const imports = [
  TypeOrmModule.forFeature([
    UserEntity,
    DeviceEntity,
    BlogsEntity,
    PostsSaEntity,
  ]),
  CqrsModule,
  ConfigModule.forRoot({
    isGlobal: true,
    load: [getConfig],
    envFilePath: '.env',
  }),
  TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
  ThrottlerModule.forRootAsync({ useClass: ThrottlerConfigService }),
];

@Module({
  imports: [...imports],
  controllers: [AppController, ...controllers],
  providers: [AppService, ...validators, ...guards, ...services, ...handlers],
})
export class AppModule {}
