import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import * as process from 'process';

export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  createThrottlerOptions():
    | Promise<ThrottlerModuleOptions>
    | ThrottlerModuleOptions {
    return {
      throttlers: [
        {
          ttl: +process.env.TTL,
          limit: +process.env.LIMIT,
        },
      ],
    };
  }
}
