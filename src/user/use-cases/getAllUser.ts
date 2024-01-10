import { UserQueryDto } from '../dto/user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../api/user.repo';

export class GetAllUser {
  constructor(public userQueryDto: UserQueryDto) {}
}

@CommandHandler(GetAllUser)
export class GetAllUserCase implements ICommandHandler<GetAllUser> {
  constructor(private readonly userRepo: UserRepo) {}
  async execute(query: GetAllUser) {}
}
