import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../api/user.service';
import { NotFoundException } from '@nestjs/common';

export class DeleteUser {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUser)
export class DeleteUserHandler implements ICommandHandler<DeleteUser> {
  constructor(private readonly userService: UserService) {}

  async execute(command: DeleteUser) {
    const user = await this.userService.findUserId(command.userId);
    if (!user) throw new NotFoundException();
    return this.userService.deleteUserId(command.userId);
  }
}
