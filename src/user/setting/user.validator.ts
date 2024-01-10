import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserRepoSql } from '../user.repo.sql';

//login
export function UserExistsLogin(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserExistsLogin',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserFindLogin,
    });
  };
}

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
class UserFindLogin implements ValidatorConstraintInterface {
  constructor(private readonly userRepoSql: UserRepoSql) {}

  async validate(login: string): Promise<boolean> {
    try {
      const findLogin = await this.userRepoSql.findUserByLogin(login);
      if (!findLogin) return false;
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
export function UserExistsEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserExistsEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserFindEmail,
    });
  };
}

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
class UserFindEmail implements ValidatorConstraintInterface {
  constructor(private readonly userRepoSql: UserRepoSql) {}

  async validate(email: string): Promise<boolean> {
    try {
      const findEmail = await this.userRepoSql.findUserByEmail(email);
      if (!findEmail) return false;
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
