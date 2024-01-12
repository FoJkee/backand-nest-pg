import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './use-cases/createUser';
import { UserRepoSql } from './api/user.repo.sql';
import { UserService } from './api/user.service';
import { GetAllUserHandler } from './use-cases/getAllUser';
import { DeleteUserHandler } from './use-cases/deleteUser';

const handlers = [CreateUserHandler, GetAllUserHandler, DeleteUserHandler];

@Module({
  imports: [CqrsModule],
  providers: [...handlers, UserRepoSql, UserService],
  controllers: [UserController],
})
export class UserModule {}
