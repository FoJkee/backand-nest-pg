import { IsEmail } from 'class-validator';

export class RegistrationEmailResendingDto {
  @IsEmail()
  readonly email: string;
}
