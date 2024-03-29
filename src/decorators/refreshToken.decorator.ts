import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceType } from './device.decorators';

export const RefreshTokenDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext): DeviceType => {
    const request = ctx.switchToHttp().getRequest();
    return request.refrestTokenDecorator;
  },
);

export const RefreshToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.payloadRefreshToken;
  },
);
