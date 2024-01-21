import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { DeviceService } from '../api/device.service';

import { DeviceEntity } from '../entity/device.entity';
import { UserEntity } from '../../user/entity/user.entity';

export class AllDeviceUserId {
  constructor(public userId: string) {}
}

@QueryHandler(AllDeviceUserId)
export class AllDeviceUserIdHandler implements IQueryHandler<AllDeviceUserId> {
  constructor(private readonly deviceService: DeviceService) {}

  async execute(command: AllDeviceUserId): Promise<DeviceEntity[]> {
    const device = await this.deviceService.getDevice(command.userId);

    return device.map(
      (d) =>
        ({
          ip: d.ip,
          deviceName: d.deviceName,
          lastActiveDate: d.lastActiveDate,
          deviceId: d.deviceId,
        }) as DeviceEntity,
    );
  }
}
