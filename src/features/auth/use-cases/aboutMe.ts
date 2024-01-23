import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from '../../user/api/user.service';
import { BadRequestException } from '@nestjs/common';

export class AboutMe {
  constructor(public userId: string) {}
}

@QueryHandler(AboutMe)
export class AboutMeHandler implements IQueryHandler<AboutMe> {
  constructor(private readonly userService: UserService) {}
  async execute(query: AboutMe) {
    const user = await this.userService.findUserId(query.userId);
    if (!user) throw new BadRequestException();
    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }
}
