import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserRepoSql } from '../api/user.repo.sql';

//login
@ValidatorConstraint({ name: 'UserExistsLogin', async: true })
@Injectable()
export class UserFindLoginValidator implements ValidatorConstraintInterface {
  constructor(private readonly userRepoSql: UserRepoSql) {}

  async validate(login: string): Promise<boolean> {
    try {
      const findLogin = await this.userRepoSql.findUserByLogin(login);
      if (findLogin) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const field: string = args.property;
    return `${field} exist`;
  }
}

//email
@ValidatorConstraint({ name: 'UserExistsEmail', async: true })
@Injectable()
export class UserFindEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly userRepoSql: UserRepoSql) {}

  async validate(email: string): Promise<boolean> {
    try {
      const findEmail = await this.userRepoSql.findUserByEmail(email);
      if (findEmail) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const field = args.property;
    return `${field} exist`;
  }
}
