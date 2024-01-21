import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './use-cases/createUser';
import { UserService } from './api/user.service';
import { GetAllUserHandler } from './use-cases/getAllUser';
import { DeleteUserHandler } from './use-cases/deleteUser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DeviceService } from '../device/api/device.service';
import { AuthService } from '../auth/infrastructure/auth.service';
import { JwtService } from '@nestjs/jwt';

const handlers = [CreateUserHandler, GetAllUserHandler, DeleteUserHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [...handlers, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
