import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import { UsersService } from '../users/users.service';

import { User } from '../users/entities/user.entity';
import { ConfirmationCode } from './entities/confirmation-code.entity';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { ConfirmationCodeType } from './enums/confirmation-code-type.enum';

import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserLogin } from '../users/entities/user-login.entity';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
    private usersService: UsersService,
    private jwtService: JwtService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(UserLogin)
    private userLoginsRepository: Repository<UserLogin>,

    @InjectRepository(ConfirmationCode)
    private codesRepository: Repository<ConfirmationCode>,
  ) {}

  generateConfirmationCode(userId: string): string {
    const data = `${userId}-${new Date().getTime()}`;
    const code = createHash('sha256').update(data).digest('hex');
    return code;
  }

  getConfirmationLink(token: string, type: ConfirmationCodeType): string {
    const url = new URL('', this.configService.get('app.baseUrl'));

    switch (type) {
      case ConfirmationCodeType.PASSWORD_RESET:
        url.pathname = '/auth/confirm-reset-password';
        break;
      case ConfirmationCodeType.EMAIL_VERIFICATION:
        url.pathname = '/auth/confirm-email';
        break;
    }

    url.searchParams.set('token', token);
    return url.toString();
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const { user } = await this.usersService.findOneUser({ email }, true);

    if (!user || !user.password) return null;

    const isValid = await bcrypt.compare(pass, user.password);

    if (isValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(
    data: LoginDto,
    loginDetails?: { ip?: string; userAgent?: string },
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password } = data;

    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('ERR_INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new HttpException('ERR_ACCOUNT_DISABLED', 423);
    }

    if (!user.isEmailVerified) {
      throw new HttpException('ERR_EMAIL_NOT_VERIFIED', 423);
    }

    const payload = { email: user.email, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    if (loginDetails) {
      const userLogin = this.userLoginsRepository.create({
        ...loginDetails,
        token,
        user,
      });

      await this.userLoginsRepository.save(userLogin);
    }

    return { token, user };
  }

  async refresh(
    id: string,
    loginDetails?: { ip?: string; userAgent?: string },
    oldToken?: string,
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { user } = await this.usersService.findOneUser({ id });
    if (!user) throw new UnauthorizedException('ERR_INVALID_CREDENTIALS');

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    if (loginDetails) {
      const lastLogin = await this.userLoginsRepository.findOne({
        where: { user: { id: user.id }, token: oldToken },
      });

      if (lastLogin) {
        lastLogin.ip = loginDetails.ip;
        lastLogin.userAgent = loginDetails.userAgent;
        lastLogin.token = token;

        await this.userLoginsRepository.save(lastLogin);
      } else {
        const userLogin = this.userLoginsRepository.create({
          ...loginDetails,
          token,
          user,
        });

        await this.userLoginsRepository.save(userLogin);
      }
    }

    return { user, token };
  }

  async register(data: RegisterDto): Promise<{ user: User }> {
    const { name, email, password: rawPassword } = data;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) throw new ConflictException('ERR_USER_ALREADY_EXISTS');

    const password = await bcrypt.hash(rawPassword, 10);

    const userData = this.usersRepository.create({ name, email, password });
    const createdUser = await this.usersRepository.save(userData);
    if (!createdUser) throw new BadRequestException('ERR_REGISTRATION_FAILED');

    const confirmationData = this.codesRepository.create({
      code: this.generateConfirmationCode(createdUser.id),
      user: createdUser,
      type: ConfirmationCodeType.EMAIL_VERIFICATION,
    });

    const confirmationCode = await this.codesRepository.save(confirmationData);

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Rejestracja konta',
        template: 'confirm-registration',
        context: {
          preheader: 'Dziękujemy za rejestrację w systemie!',
          link: this.getConfirmationLink(
            confirmationCode.code,
            ConfirmationCodeType.EMAIL_VERIFICATION,
          ),
        },
      })
      .catch(console.error);

    const user = await this.usersRepository.findOneBy({ id: createdUser.id });

    return { user };
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ success: boolean }> {
    const { email } = data;

    const user = await this.usersRepository.findOneBy({ email });

    if (!user) return { success: true };

    const existingCode = await this.codesRepository.findOneBy({
      user: { email },
      type: ConfirmationCodeType.PASSWORD_RESET,
      expiresAt: MoreThan(new Date()),
      wasUsed: Not(true),
    });

    if (existingCode) return { success: true };

    const confirmationData = this.codesRepository.create({
      code: this.generateConfirmationCode(user.id),
      user,
      type: ConfirmationCodeType.PASSWORD_RESET,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    const confirmationCode = await this.codesRepository.save(confirmationData);

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Reset hasła w systemie',
        template: 'reset-password',
        context: {
          preheader: 'Potwierdź reset hasła w systemie!',
          link: this.getConfirmationLink(
            confirmationCode.code,
            ConfirmationCodeType.PASSWORD_RESET,
          ),
        },
      })
      .catch(console.error);

    return { success: true };
  }

  async confirmResetPassword(
    data: ConfirmResetPasswordDto,
  ): Promise<{ success: boolean }> {
    const { token, password } = data;

    const confirmationCode = await this.codesRepository.findOne({
      where: {
        code: token,
        type: ConfirmationCodeType.PASSWORD_RESET,
        expiresAt: MoreThan(new Date()),
        wasUsed: Not(true),
      },
      relations: ['user'],
    });

    if (!confirmationCode || !confirmationCode.user) {
      throw new UnauthorizedException('ERR_INVALID_TOKEN');
    }

    const user = confirmationCode.user;
    user.password = await bcrypt.hash(password, 10);
    await this.usersRepository.save(user);

    confirmationCode.wasUsed = true;
    await this.codesRepository.save(confirmationCode);

    return { success: true };
  }

  async confirmEmail(data: ConfirmEmailDto): Promise<{ success: boolean }> {
    const { token } = data;

    const confirmationCode = await this.codesRepository
      .createQueryBuilder('code')
      .select()
      .leftJoinAndSelect('code.user', 'user')
      .where('code.code = :token', { token })
      .andWhere('code.type = :type', {
        type: ConfirmationCodeType.EMAIL_VERIFICATION,
      })
      .andWhere('(code.expiresAt IS NULL OR code.expiresAt > :now)', {
        now: new Date(),
      })
      .andWhere('code.wasUsed != :wasUsed', { wasUsed: true })
      .getOne();

    if (!confirmationCode || !confirmationCode.user) {
      throw new UnauthorizedException('ERR_INVALID_TOKEN');
    }

    const user = confirmationCode.user;
    user.isEmailVerified = true;
    await this.usersRepository.save(user);

    confirmationCode.wasUsed = true;
    await this.codesRepository.save(confirmationCode);

    return { success: true };
  }

  async updateSettings(
    data: UpdateSettingsDto,
    user: JwtPayload,
  ): Promise<{ user: User }> {
    const { name, email } = data;
    const { id } = user;

    const foundUser = await this.usersRepository.findOneBy({ id });
    if (!foundUser) {
      throw new NotFoundException('ERR_USER_NOT_FOUND');
    }

    if (email) {
      const existingUser = await this.usersRepository.findOneBy({ email });
      if (existingUser && existingUser.id !== foundUser.id) {
        throw new BadRequestException('ERR_USER_ALREADY_EXISTS');
      }
      foundUser.email = email;
    }

    if (name) {
      foundUser.name = name;
    }

    try {
      const updatedUser = await this.usersRepository.save(foundUser);
      return { user: updatedUser };
    } catch (error) {
      throw new BadRequestException('ERR_USER_NOT_UPDATED');
    }
  }

  async changePassword(
    data: ChangePasswordDto,
    user: JwtPayload,
  ): Promise<{ success: boolean }> {
    const { oldPassword, newPassword } = data;
    const { id } = user;

    const where = { id };
    const select = { id: true, password: true };

    const foundUser = await this.usersRepository.findOne({ where, select });
    if (!foundUser) {
      throw new NotFoundException('ERR_USER_NOT_FOUND');
    }

    const isValid = await bcrypt.compare(oldPassword, foundUser.password);
    if (!isValid) {
      throw new UnauthorizedException('ERR_INVALID_PASSWORD');
    }

    try {
      foundUser.password = await bcrypt.hash(newPassword, 10);
      await this.usersRepository.save(foundUser);
      return { success: true };
    } catch (error) {
      throw new BadRequestException('ERR_USER_NOT_UPDATED');
    }
  }
}
