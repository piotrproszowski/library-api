import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { StructureModule } from './structure/structure.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { MailerModule } from './mailer/mailer.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    MailerModule,
    AuthModule,
    UsersModule,
    StructureModule,
    RentModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
