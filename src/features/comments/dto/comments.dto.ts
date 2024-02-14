import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentDto {
  @IsString()
  @Length(20, 300)
  content: string;
}

export class CommentQueryDto {
  @IsString()
  @IsOptional()
  sortBy: string | null = 'createdAt';
  @IsString()
  @IsOptional()
  sortDirection: string | null = 'desc';
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageNumber: number | null = 1;
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize: number | null = 10;
}
