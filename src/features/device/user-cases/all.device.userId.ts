import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DeviceService } from '../api/device.service';

import { DeviceEntity } from '../entity/device.entity';
import { AuthService } from '../../auth/infrastructure/auth.service';

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
          deviceId: d.deviceId,
          ip: d.ip,
          lastActiveDate: d.lastActiveDate,
          title: d.title,
        }) as DeviceEntity,
    );
  }
}
