import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserService } from '../api/user.service';
import { UserModelView, UserModelResult } from '../dto/user.model';
import { UserDto } from '../dto/user.dto';

export class CreateUser {
  constructor(public readonly userDto: UserDto) {}
}

@CommandHandler(CreateUser)
export class CreateUserHandler implements ICommandHandler<CreateUser> {
  constructor(private readonly userService: UserService) {}

  async execute(command: CreateUser): Promise<UserModelResult> {
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
      createdAt: new Date(),
      codeConfirmation: randomUUID(),
      isConfirmed: false,
    };

    const createNewUser = await this.userService.createUser(newUser);

    return {
      id: createNewUser.id,
      login: createNewUser.login,
      email: createNewUser.email,
      createdAt: createNewUser.createdAt,
    };
  }
}
