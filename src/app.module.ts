import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';

import { SharedModule } from './domains/shared/shared.module';
import { UserModule } from './domains/user/user.module';
import { AuthModule } from './domains/auth/auth.module';
import { LibraryModule } from './domains/library/library.module';
import { RentalModule } from './domains/rental/rental.module';
import { JwtAuthGuard } from './domains/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './domains/auth/infrastructure/guards/roles.guard';

@Module({
  imports: [SharedModule, UserModule, AuthModule, LibraryModule, RentalModule],
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
