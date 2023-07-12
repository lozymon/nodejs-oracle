import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type NodeEnvType = 'development' | 'production';

export interface IConfig {
  node_env: NodeEnvType;
  port: number;
  domain: string;
  db: TypeOrmModuleOptions;
  throttler: ThrottlerModuleOptions;
}
