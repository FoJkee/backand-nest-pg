import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationConfirmationDto } from '../dto/registrationConfirmation.dto';
import { UserService } from '../../user/api/user.service';
import { BadRequestException } from '@nestjs/common';

export class RegistrationConfirmation {
  constructor(
    public registrationConfirmationDto: RegistrationConfirmationDto,
  ) {}
}

@CommandHandler(RegistrationConfirmation)
export class RegistrationConfirmationHandler
  implements ICommandHandler<RegistrationConfirmation>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: RegistrationConfirmation) {
    const findUserByCode = await this.userService.findUserByCode(
      command.registrationConfirmationDto.code,
    );
    if (!findUserByCode)
      throw new BadRequestException([
        {
          message: "Code don't exist",
          field: 'code',
        },
      ]);

    if (findUserByCode.isConfirmed)
      throw new BadRequestException([
        {
          message: 'Code is confirmed',
          field: 'code',
        },
      ]);

    await this.userService.findUserAndUpdateCode(findUserByCode.id);
    return;
  }
}
