import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../infrastructure/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/api/user.service';
import { DeviceService } from '../../device/api/device.service';

export class RefreshTokenClass {
  constructor(public token: string) {}
}

@CommandHandler(RefreshTokenClass)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenClass> {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly deviceService: DeviceService,
  ) {}

  async execute(command: RefreshTokenClass) {
    const dataToken = await this.authService.verifyRefreshToken(command.token);
    if (!dataToken) throw new UnauthorizedException();

    const findUser = await this.userService.findUserId(dataToken.userId);
    if (!findUser) throw new UnauthorizedException();

    const { accessToken: accessTokenNew, refreshToken: refreshTokenNew } =
      await this.authService.generateToken(
        dataToken.userId,
        dataToken.deviceId,
      );

    const lastActiveDateNew =
      await this.authService.decodeToken(refreshTokenNew);

    await this.deviceService.updateDevice(
      dataToken.userId,
      dataToken.deviceId,
      lastActiveDateNew.toISOString(),
    );

    return { accessTokenNew, refreshTokenNew };
  }
}
