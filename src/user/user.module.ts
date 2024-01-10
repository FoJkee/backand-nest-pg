import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserCase } from './use-cases/createUser';
import { UserRepoSql } from './user.repo.sql';
import { UserRepo } from './api/user.repo';

@Module({
  imports: [CqrsModule],
  providers: [CreateUserCase, UserRepoSql, UserRepo],
  controllers: [UserController],
})
export class UserModule {}
