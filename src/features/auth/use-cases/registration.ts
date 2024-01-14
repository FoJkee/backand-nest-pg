import { RegistrationDto } from '../dto/registration.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../user/api/user.service';
import * as bcrypt from 'bcrypt';
import { UserModelView } from '../../user/dto/user.model';
import { randomUUID } from 'crypto';
import { EmailService } from '../../../setting/email.service';

export class Registration {
  constructor(public readonly registrationDto: RegistrationDto) {}
}

@CommandHandler(Registration)
export class RegistrationHandler implements ICommandHandler<Registration> {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: Registration) {
    const passwordSalt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(
      command.registrationDto.password,
      passwordSalt,
    );

    const newUser: UserModelView = {
      id: randomUUID(),
      login: command.registrationDto.login,
      email: command.registrationDto.email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
      codeConfirmation: randomUUID(),
      isConfirmed: false,
    };

    await this.userService.createOneUser(newUser);
    await this.emailService.sendEmail(
      newUser.email,
      'Registration',
      `<h1>Registation</h1>
            <p>To finish registration please follow the link below:
             <a href="https://somesite.com/confirm-email?code=${newUser.codeConfirmation}">complete registration</a>
            </p>`,
    );
    return;
  }
}
