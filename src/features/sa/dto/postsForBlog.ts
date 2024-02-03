import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export class CreatePostForBlogsSaDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 30)
  title: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 1000)
  content: string;
}

export class PostsForBlogQueryDto {
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
