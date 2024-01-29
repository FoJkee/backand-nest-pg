import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceService } from '../../device/api/device.service';
import { DeviceType } from '../../../decorators/device.decorators';
import { DeviceDto } from '../../device/dto/device.dto';

export class Logout {
  constructor(
    public deviceDto: DeviceDto,
    public userId: string,
  ) {}
}

@CommandHandler(Logout)
export class LogoutHandler implements ICommandHandler<Logout> {
  constructor(private readonly deviceService: DeviceService) {}
  async execute(command: Logout) {
    const lastActiveDate = new Date(command.deviceDto.iat * 1000).toISOString();

    return await this.deviceService.deleteDeviceSessionUserId(
      command.deviceDto.deviceId,
      command.userId,
      lastActiveDate,
    );
  }
}
