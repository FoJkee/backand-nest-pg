import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../api/user.repo';
import { NotFoundException } from '@nestjs/common';

export class DeleteUser {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUser)
export class DeleteUserCase implements ICommandHandler<DeleteUser> {
  constructor(private readonly userRepo: UserRepo) {}

  async execute(command: DeleteUser) {
    const deleteUser = await this.userRepo.deleteUserId(command.userId);
    if (deleteUser.deleteCount === 0) {
      throw new NotFoundException();
    } else {
      return;
    }
  }
}
