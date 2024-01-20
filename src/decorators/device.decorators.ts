import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type DeviceType = {
  deviceId: string | null;
  deviceName: string;
  ip: string;
};

export const DeviceDecorators = createParamDecorator(
  (data: string, ctx: ExecutionContext): DeviceType => {
    const request = ctx.switchToHttp().getRequest();

    return {
      deviceId: request.deviceId ?? randomUUID(),
      deviceName: request.get('user-agent'),
      ip: request.ip,
    };
  },
);
