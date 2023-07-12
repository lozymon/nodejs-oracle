import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { IConfig, NodeEnvType } from './interfaces/config.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function config(): IConfig {
  const dbOptions = {
    type: 'oracle',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    serviceName: process.env.DATABASE_SERIVCE_NAME,
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    autoLoadEntities: true,
    logging: true,
  } satisfies TypeOrmModuleOptions;

  const ThrottlerOptions = {
    ttl: parseInt(process.env.THROTTLE_TTL),
    limit: parseInt(process.env.THROTTLE_LIMIT),
  } satisfies ThrottlerModuleOptions;

  return {
    node_env: process.env.NODE_ENV as NodeEnvType,
    port: parseInt(process.env.PORT, 10),
    domain: process.env.DOMAIN,
    db: dbOptions,
    throttler: ThrottlerOptions,
  };
}
