import {
  Body,
  Controller,
  Headers,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RealIp } from 'nestjs-real-ip';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from './types/jwt-payload.type';

import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Public()
  @Post('login')
  async login(
    @Body() data: LoginDto,
    @RealIp() ip?: string,
    @Headers('User-Agent') userAgent?: string,
  ) {
    return this.authService.login(data, { ip, userAgent });
  }

  @ApiBearerAuth()
  @Post('refresh')
  refresh(
    @User() user: JwtPayload,
    @RealIp() ip?: string,
    @Headers('User-Agent') userAgent?: string,
    @Headers('Authorization') authorization?: string,
  ) {
    const oldToken = authorization.split(' ')[1];
    return this.authService.refresh(user.id, { ip, userAgent }, oldToken);
  }

  @Public()
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Public()
  @Post('confirm-email')
  confirmEmail(@Body() data: ConfirmEmailDto) {
    return this.authService.confirmEmail(data);
  }

  @ApiBearerAuth()
  @Patch('update-settings')
  updateSettings(@Body() data: UpdateSettingsDto, @User() user: JwtPayload) {
    return this.authService.updateSettings(data, user);
  }

  @ApiBearerAuth()
  @Patch('change-password')
  changePassword(@Body() data: ChangePasswordDto, @User() user: JwtPayload) {
    return this.authService.changePassword(data, user);
  }
}
