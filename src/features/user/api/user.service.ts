import { Injectable } from '@nestjs/common';
import { UserRepoSql } from './user.repo.sql';
import { UserModelView } from '../dto/user.model';
import { UserQueryDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepoSql: UserRepoSql) {}

  async createOneUser(newUser: UserModelView) {
    return await this.userRepoSql.createUser(newUser);
  }
  async deleteUserId(userId: string) {
    return await this.userRepoSql.deleteUserId(userId);
  }

  async getUsers(userQueryDto: UserQueryDto) {
    return await this.userRepoSql.getUsers(userQueryDto);
  }
}
