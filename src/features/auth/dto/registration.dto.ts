import { IsEmail, IsString, Length, Validate } from 'class-validator';
import {
  UserFindEmailValidator,
  UserFindLoginValidator,
} from '../../user/setting/user.validator';

export class RegistrationDto {
  @IsString()
  @Validate(UserFindLoginValidator)
  @Length(3, 10)
  readonly login: string;

  @IsString()
  @Length(6, 20)
  readonly password: string;

  @IsString()
  @IsEmail()
  @Validate(UserFindEmailValidator)
  readonly email: string;
}
