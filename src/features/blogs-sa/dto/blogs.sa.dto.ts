import { IsString, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateBlogsSaDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 15)
  name: string;
  @IsString()
  @Length(1, 500)
  description: string;
  @IsString()
  @Length(1, 100)
  @IsUrl()
  websiteUrl: string;
}
