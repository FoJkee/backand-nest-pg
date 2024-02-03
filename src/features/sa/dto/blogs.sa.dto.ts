import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export class CreateBlogsSaDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 15)
  name: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 500)
  description: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 100)
  @IsUrl()
  websiteUrl: string;
}

export class BlogQueryDto {
  @IsString()
  @IsOptional()
  searchNameTerm?: string | null = null;
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';
  @IsString()
  @IsOptional()
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
