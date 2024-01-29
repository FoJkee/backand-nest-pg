import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserId } from '../../../decorators/user.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteDeviceId } from '../user-cases/delete.deviceid';
import { RefreshTokensGuard } from '../../../guards/refreshTokens.guard';
import { AllDeviceUserId } from '../user-cases/all.device.userId';
import { DeleteAllOtherSession } from '../user-cases/deleteAllOtherSession';
import { RefreshTokenDecorator } from '../../../decorators/refreshToken.decorator';
import { DeviceDto } from '../dto/device.dto';

@Controller('security')
export class DeviceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('devices')
  @UseGuards(RefreshTokensGuard)
  @HttpCode(200)
  async getDevice(@UserId() userId: string) {
    return this.queryBus.execute(new AllDeviceUserId(userId));
  }

  @Delete('devices')
  @UseGuards(RefreshTokensGuard)
  @HttpCode(204)
  async deleteAllOtherSession(@RefreshTokenDecorator() device: DeviceDto) {
    return this.commandBus.execute(new DeleteAllOtherSession(device));
  }

  @Delete('devices/:deviceId')
  @UseGuards(RefreshTokensGuard)
  @HttpCode(204)
  async deleteDeviceId(
    @Param('deviceId') deviceId: string,
    @UserId() userId: string,
  ) {
    return this.commandBus.execute(new DeleteDeviceId(deviceId, userId));
  }
}
