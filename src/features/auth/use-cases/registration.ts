import { RegistrationDto } from '../dto/registration.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../user/api/user.service';
import * as bcrypt from 'bcrypt';
import { UserModelView } from '../../user/dto/user.model';
import { randomUUID } from 'crypto';

export class Registration {
  constructor(public readonly registrationDto: RegistrationDto) {}
}

@CommandHandler(Registration)
export class RegistrationHandler implements ICommandHandler<Registration> {
  constructor(private readonly userRepo: UserService) {}
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
    await this.userRepo.createOneUser(newUser);
  }
}
