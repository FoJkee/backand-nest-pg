import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserId } from '../../../decorators/user.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeleteDeviceId } from '../user-cases/delete.deviceid';
import { RefreshTokensGuard } from '../../../guards/refreshTokens.guard';
import { AllDeviceUserId } from '../user-cases/all.device.userId';
import { DeleteAllOtherSession } from '../user-cases/deleteAllOtherSession';
import { Request } from 'express';

@Controller('security')
export class DeviceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('devices')
  @UseGuards(RefreshTokensGuard)
  @HttpCode(HttpStatus.OK)
  async getDevice(@UserId() userId: string) {
    return await this.queryBus.execute(new AllDeviceUserId(userId));
  }

  @Delete('devices')
  @UseGuards(RefreshTokensGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllOtherSession(@Req() req: Request) {
    return this.commandBus.execute(
      new DeleteAllOtherSession(req.cookies.refreshToken),
    );
  }

  @Delete('devices/:deviceId')
  @UseGuards(RefreshTokensGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeviceId(
    @Param('deviceId') deviceId: string,
    @UserId() userId: string,
  ) {
    return await this.commandBus.execute(new DeleteDeviceId(deviceId, userId));
  }
}
