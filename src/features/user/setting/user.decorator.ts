import { registerDecorator, ValidationOptions } from 'class-validator';
import { UserFindEmail, UserFindLogin } from './user.validator';

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
