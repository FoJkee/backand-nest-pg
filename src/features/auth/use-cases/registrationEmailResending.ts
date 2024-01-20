import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationEmailResendingDto } from '../dto/registrationEmailResending.dto';
import { UserService } from '../../user/api/user.service';
import { randomUUID } from 'crypto';
import { EmailService } from '../../../setting/email.service';
import { BadRequestException } from '@nestjs/common';

export class RegistrationEmailResending {
  constructor(
    public readonly registrationEmailResendingDto: RegistrationEmailResendingDto,
  ) {}
}

@CommandHandler(RegistrationEmailResending)
export class RegistrationEmailResendingHandler
  implements ICommandHandler<RegistrationEmailResending>
{
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: RegistrationEmailResending) {
    const findUserEmail = await this.userService.findUserByEmail(
      command.registrationEmailResendingDto.email,
    );

    if (!findUserEmail)
      throw new BadRequestException([
        {
          message: "Email don't exist",
          filed: 'email',
        },
      ]);
    if (findUserEmail.isConfirmed)
      throw new BadRequestException([
        {
          message: 'Email is confirmed',
          filed: 'email',
        },
      ]);

    const newCodeConfirmation = randomUUID();

    const updateUserCode = await this.userService.registrationEmailResending(
      newCodeConfirmation,
      command.registrationEmailResendingDto.email,
    );
    await this.emailService.sendEmail(
      command.registrationEmailResendingDto.email,
      'Email resending confirmation',
      `<h1>Email resending confirmation</h1>
            <p>To finish email resending please follow the link below:
             <a href='https://somesite.com/confirm-email?code=${updateUserCode.codeConfirmation}'>complete registration</a>
            </p>`,
    );
    return;
  }
}
