import { UserDto } from '../dto/user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserRepo } from '../api/user.repo';
import { UserModelView } from '../dto/user.model';

export class CreateUser {
  constructor(public readonly userDto: UserDto) {}
}

@CommandHandler(CreateUser)
export class CreateUserCase implements ICommandHandler<CreateUser> {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(command: CreateUser) {
    const passwordSalt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(
      command.userDto.password,
      passwordSalt,
    );

    const newUser: UserModelView = {
      id: randomUUID(),
      login: command.userDto.login,
      email: command.userDto.email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
      codeConfirmation: randomUUID(),
      isConfirmed: false,
    };

    const createNewUser = await this.userRepo.createOneUser(newUser);

    return {
      id: createNewUser.id,
      login: createNewUser.login,
      email: createNewUser.email,
      createdAt: createNewUser.createdAt,
    };
  }
}
