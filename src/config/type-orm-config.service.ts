import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly DATABASE_HOST = 'DATABASE_HOST';
  private readonly DATABASE_PORT = 'DATABASE_PORT';
  private readonly DATABASE_USERNAME = 'DATABASE_USERNAME';
  private readonly DATABASE_PASSWORD = 'DATABASE_PASSWORD';
  private readonly DATABASE_SERIVCE_NAME = 'DATABASE_SERIVCE_NAME';
  private readonly DATABASE_SYNCHRONIZE = 'DATABASE_SYNCHRONIZE';

  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config = {
      type: 'oracle',
      host: this.env(this.DATABASE_HOST),
      port: this.env(this.DATABASE_PORT, 'number'),
      username: this.env(this.DATABASE_USERNAME),
      password: this.env(this.DATABASE_PASSWORD),
      serviceName: this.env(this.DATABASE_SERIVCE_NAME),
      entities: [],
      synchronize: this.env(this.DATABASE_SYNCHRONIZE, 'boolean'),
      autoLoadEntities: true,
      logging: true,
    } satisfies TypeOrmModuleOptions;

    return config;
  }

  private env(key: string, type: 'boolean' | 'number' | 'string' = 'string') {
    if (type === 'boolean') {
      return Boolean(this.config.get(key));
    } else if (type === 'number') {
      return parseInt(this.config.get(key));
    } else {
      return this.config.get(key);
    }
  }
}
