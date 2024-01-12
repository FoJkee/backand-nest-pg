import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserExistsEmail, UserExistsLogin } from '../setting/user.decorator';

export class UserDto {
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

export class UserQueryDto {
  @IsString()
  @IsOptional()
  searchLoginTerm?: string | null = null;

  @IsString()
  @IsOptional()
  searchEmailTerm?: string | null = null;

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
