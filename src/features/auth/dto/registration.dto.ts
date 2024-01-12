import { IsEmail, IsString, Length } from 'class-validator';
import {
  UserExistsEmail,
  UserExistsLogin,
} from '../../user/setting/user.decorator';

export class RegistrationDto {
  @IsString()
  @UserExistsLogin()
  @Length(3, 10)
  readonly login: string;

  @IsString()
  @Length(6, 20)
  readonly password: string;

  @IsString()
  @IsEmail()
  @UserExistsEmail()
  readonly email: string;
}
