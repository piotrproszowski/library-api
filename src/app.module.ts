import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StructureModule } from './structure/structure.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { RentRegistryModule } from './structure/rent-registry/rent-registry.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UsersModule,
    StructureModule,
    DatabaseModule,
    RentRegistryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
