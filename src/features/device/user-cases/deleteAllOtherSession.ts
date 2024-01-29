import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceService } from '../api/device.service';
import { DeviceDto } from '../dto/device.dto';

export class DeleteAllOtherSession {
  constructor(public device: DeviceDto) {}
}

@CommandHandler(DeleteAllOtherSession)
export class DeleteAllOtherSessionHandler
  implements ICommandHandler<DeleteAllOtherSession>
{
  constructor(private readonly deviceService: DeviceService) {}

  async execute(command: DeleteAllOtherSession) {
    return this.deviceService.deleteAllOtherSession(
      command.device.deviceId,
      command.device.userId,
    );
  }
}
