import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepoSql } from './user.repo.sql';
import { UserModelView } from '../dto/user.model';
import { UserQueryDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

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
  async registrationEmailResending(code: string, email: string) {
    return await this.userRepoSql.registrationEmailResending(code, email);
  }
  async findUserByEmail(email: string) {
    return await this.userRepoSql.findUserByEmail(email);
  }
  async findUserAndUpdateCode(userId: string) {
    return await this.userRepoSql.findUserAndUpdateCode(userId);
  }
  async findUserByCode(code: string) {
    return await this.userRepoSql.findUserByCode(code);
  }
  async validateUserAndPass(loginOrEmail: string, password: string) {
    const user = await this.userRepoSql.findUserByLoginOrEmail(loginOrEmail);
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) return null;
    return user;
  }
}
