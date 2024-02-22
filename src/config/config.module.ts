import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import databaseConfig from './database.config';
import uploadConfig from './upload.config';
import authConfig from './auth.config';
import mailConfig from './mail.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, uploadConfig, authConfig, mailConfig],
    }),
  ],
})
export class ConfigModule {}
