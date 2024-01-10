import { Injectable } from '@nestjs/common';
import { UserRepoSql } from '../user.repo.sql';
import { UserModelView } from '../dto/user.model';

@Injectable()
export class UserRepo {
  constructor(private readonly userRepoSql: UserRepoSql) {}

  async createOneUser(newUser: UserModelView) {
    return await this.userRepoSql.createUser(newUser);
  }
  async deleteUserId(userId: string) {
    return await this.userRepoSql.deleteUserId(userId);
  }

  // async getUsers(query: UserQueryDto) {
  //   return await this.userRepoSql.getUsers(query);
  // }
}
