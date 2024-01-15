import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  readonly loginOrEmail: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
