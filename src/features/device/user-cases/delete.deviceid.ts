import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceService } from '../api/device.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteDeviceId {
  constructor(
    public deviceId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteDeviceId)
export class DeleteDeviceIdHandler implements ICommandHandler<DeleteDeviceId> {
  constructor(private readonly deviceService: DeviceService) {}

  async execute(command: DeleteDeviceId) {
    const session = await this.deviceService.findDeviceId(command.deviceId);
    if (!session) throw new NotFoundException();

    if (session.userId !== command.userId) throw new ForbiddenException();
    return await this.deviceService.deleteDeviceId(
      command.deviceId,
      command.userId,
    );
  }
}
