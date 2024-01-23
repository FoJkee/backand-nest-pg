import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceService } from '../../device/api/device.service';
import { DeviceType } from '../../../decorators/device.decorators';

export class Logout {
  constructor(
    public deviceType: DeviceType,
    public userId: string,
  ) {}
}

@CommandHandler(Logout)
export class LogoutHandler implements ICommandHandler<Logout> {
  constructor(private readonly deviceService: DeviceService) {}
  async execute(command: Logout) {
    return await this.deviceService.deleteDeviceSessionUserId(
      command.deviceType.deviceId,
      command.userId,
    );
  }
}
