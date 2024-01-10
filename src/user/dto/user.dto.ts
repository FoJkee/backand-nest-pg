import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserExistsEmail, UserExistsLogin } from '../setting/user.validator';
import { Type } from 'class-transformer';

export class UserDto {
  @IsString()
  @Length(3, 10)
  @UserExistsLogin()
  readonly login: string;

  @IsString()
  @Length(6, 20)
  readonly password: string;

  @IsString()
  @IsEmail()
  @UserExistsEmail()
  readonly email: string;
}

export class UserQueryDto {
  @IsString()
  searchLoginTerm: string | null = null;
  @IsString()
  searchEmailTerm: string | null = null;
  @IsString()
  sortBy: string = 'createdAt';
  @IsString()
  sortDirection: string = 'desc';

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageNumber: number = 1;
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize: number = 10;
}
