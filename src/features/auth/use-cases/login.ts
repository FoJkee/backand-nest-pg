import { LoginDto } from '../dto/login.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../user/api/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../infrastructure/auth.service';
import { DeviceType } from '../../../decorators/device.decorators';
import { DeviceService } from '../../device/api/device.service';
import * as bcrypt from 'bcrypt';

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
    const user = await this.userService.findUserByLoginOrEmail(
      command.loginDto.loginOrEmail,
    );
    if (!user) throw new UnauthorizedException();

    const comparePassword = await bcrypt.compare(
      command.loginDto.password,
      user.password,
    );
    if (!comparePassword) throw new UnauthorizedException();

    const { accessToken, refreshToken } = await this.authService.generateToken(
      user.id,
      command.deviceType.deviceId,
    );

    const lastActiveDate = await this.authService.decodeToken(refreshToken);

    const createDevice = {
      ip: command.deviceType.ip,
      title: command.deviceType.deviceName,
      lastActiveDate: lastActiveDate,
      deviceId: command.deviceType.deviceId,
      userId: user.id,
    };

    await this.deviceService.createDevice(createDevice);

    return { accessToken, refreshToken };
  }
}
