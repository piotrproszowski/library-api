import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfirmationCode } from './entities/confirmation-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConfirmationCode]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
