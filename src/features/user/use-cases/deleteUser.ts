import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../api/user.service';
import { NotFoundException } from '@nestjs/common';

export class DeleteUser {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUser)
export class DeleteUserHandler implements ICommandHandler<DeleteUser> {
  constructor(private readonly userRepo: UserService) {}

  async execute(command: DeleteUser) {
    const deleteUser = await this.userRepo.deleteUserId(command.userId);
    if (deleteUser.deleteCount === 0) {
      throw new NotFoundException();
    } else {
      return;
    }
  }
}
