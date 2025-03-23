import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import databaseConfig from './database.config';
import uploadConfig from './upload.config';
import authConfig from './auth.config';
import mailConfig from './mail.config';
import appConfig from './app.config';
import securityConfig from './security.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        uploadConfig,
        authConfig,
        mailConfig,
        securityConfig,
      ],
    }),
  ],
})
export class ConfigModule {}
