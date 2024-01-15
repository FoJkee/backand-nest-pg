import { LoginDto } from '../dto/login.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../user/api/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../infrastructure/auth.service';
import { DeviceType } from '../../../decorators/deviceEntity';
import { DeviceService } from '../../device/device.service';
import { DeviceModels } from '../../device/dto/device.models';

export class Login {
  constructor(
    public loginDto: LoginDto,
    public deviceType: DeviceType,
  ) {}
}

@CommandHandler(Login)
export class LoginHandler implements ICommandHandler<Login> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly deviceService: DeviceService,
  ) {}

  async execute(command: Login) {
    const validateUser = await this.userService.validateUserAndPass(
      command.loginDto.loginOrEmail,
      command.loginDto.password,
    );
    if (!validateUser) throw new UnauthorizedException();

    const { accessToken, refreshToken } = await this.authService.generateToken(
      validateUser.id,
      command.deviceType.deviceId,
    );

    const lastActiveDate = await this.authService.decodeToken(refreshToken);

    const createDevice: DeviceModels = {
      ip: command.deviceType.ip,
      userId: validateUser.id,
      deviceId: command.deviceType.deviceId,
      deviceName: command.deviceType.deviceName,
      lastActiveDate,
    };

    await this.deviceService.createDevice(createDevice);

    return { accessToken, refreshToken };
  }
}
