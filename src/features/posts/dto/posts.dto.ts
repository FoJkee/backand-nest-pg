import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PostQueryDto {
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
