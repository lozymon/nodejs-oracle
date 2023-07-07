import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  private readonly THROTTLE_TTL = 'THROTTLE_TTL';
  private readonly THROTTLE_LIMIT = 'THROTTLE_LIMIT';

  constructor(private readonly config: ConfigService) {}
  createThrottlerOptions(): ThrottlerModuleOptions | Promise<ThrottlerModuleOptions> {
    const config = {
      ttl: this.env(this.THROTTLE_TTL),
      limit: this.env(this.THROTTLE_LIMIT),
    } satisfies ThrottlerModuleOptions;

    return config;
  }

  private env(key: string) {
    return parseInt(this.config.get(key));
  }
}
