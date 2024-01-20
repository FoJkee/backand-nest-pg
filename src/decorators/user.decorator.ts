import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceType } from './device.decorators';

export const UserId = createParamDecorator(
  (data: string, ctx: ExecutionContext): DeviceType => {
    const request = ctx.switchToHttp().getRequest();
    return request.userId;
  },
);
