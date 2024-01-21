import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../features/auth/infrastructure/auth.service';
import { DeviceService } from '../features/device/api/device.service';
import { UserService } from '../features/user/api/user.service';

@Injectable()
export class RefreshTokensGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedException();

    const dataToken = await this.authService.verifyRefreshToken(refreshToken);
    if (!dataToken) throw new UnauthorizedException();

    const iatDataToken = new Date(dataToken.iat * 1000).toISOString();

    const device = await this.deviceService.findDeviceUserId(
      dataToken.deviceId,
      dataToken.userId,
    );

    if (
      !device ||
      (device && device.lastActiveDate.toISOString() !== iatDataToken)
    )
      throw new UnauthorizedException();
    //
    if (device.userId !== dataToken.userId) throw new UnauthorizedException();

    const user = await this.userService.findUserId(dataToken.userId);
    if (!user) throw new UnauthorizedException();

    request.user = user;
    request.refrestTokenDecorator = dataToken;
    return true;
  }
}
