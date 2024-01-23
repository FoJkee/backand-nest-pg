import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceService } from '../api/device.service';
import { AuthService } from '../../auth/infrastructure/auth.service';
import { UnauthorizedException } from '@nestjs/common';

export class DeleteAllOtherSession {
  constructor(public refreshToken: string) {}
}

@CommandHandler(DeleteAllOtherSession)
export class DeleteAllOtherSessionHandler
  implements ICommandHandler<DeleteAllOtherSession>
{
  constructor(
    private readonly deviceService: DeviceService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: DeleteAllOtherSession) {
    const dataToken = await this.authService.verifyRefreshToken(
      command.refreshToken,
    );
    if (!dataToken) throw new UnauthorizedException();

    return await this.deviceService.deleteAllOtherSession(
      dataToken.deviceId,
      dataToken.userId,
    );
  }
}
