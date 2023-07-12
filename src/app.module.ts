import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { validationSchema } from './config/config.schema';
import { ThrottlerConfigService } from './config/throttler.config';
import { TypeOrmConfig } from './config/type-orm.config';
import { ThrottlerBehindProxyGuard } from './guards/throttler-behind-proxy.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema, load: [config] }),
    ThrottlerModule.forRootAsync({ useClass: ThrottlerConfigService }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
