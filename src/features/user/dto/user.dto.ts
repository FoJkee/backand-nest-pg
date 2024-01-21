import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  UserFindEmailValidator,
  UserFindLoginValidator,
} from '../setting/user.validator';

export class UserDto {
  @IsString()
  @Length(3, 10)
  @Validate(UserFindLoginValidator)
  login: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsEmail()
  @Validate(UserFindEmailValidator)
  email: string;
}

export class UserQueryDto {
  @IsString()
  @IsOptional()
  searchLoginTerm?: string | null = null;

  @IsString()
  @IsOptional()
  searchEmailTerm?: string | null = null;

  @IsString()
  sortBy: string | null = 'createdAt';

  @IsString()
  sortDirection: string | null = 'desc';

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageNumber: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize: number = 10;
}
