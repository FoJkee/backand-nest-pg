import { IsString, IsUUID } from 'class-validator';

export class RegistrationConfirmationDto {
  @IsString()
  @IsUUID()
  readonly code: string;
}
