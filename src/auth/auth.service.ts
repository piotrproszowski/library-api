import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './types/jwt-payload.type';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfirmationCode } from './entities/confirmation-code.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserLogin } from 'src/users/entities/user-login.entity';
import { createHash } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { ConfirmationCodeType } from './enums/confirmation-code-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // private readonly mailerService: MailerService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(UserLogin)
    private userLoginsRepository: Repository<UserLogin>,

    @InjectRepository(ConfirmationCode)
    private codesRepository: Repository<ConfirmationCode>,
  ) {}

  /**
   * Generates a confirmation code using the SHA256 hash function.
   *
   * @param {string} userId - The ID of the user for which to generate the confirmation code.
   * @return {string} The confirmation code generated for the given user ID.
   */
  generateConfirmationCode(userId: string): string {
    const data = `${userId}-${new Date().getTime()}`;
    const code = createHash('sha256').update(data).digest('hex');
    return code;
  }

  createConfirmationLink(token: string, type: ConfirmationCodeType): string {
    const createdUrl = new URL('', this.configService.get('app.baseUrl'));

    return;
  }

  /**
   * Validates the email and password of a user and returns the user object if the credentials are valid.
   *
   * @param {string} email - The email of the user to validate.
   * @param {string} pass - The password of the user to validate.
   * @return {Promise<Omit<User, 'password'> | null>} The user object if the credentials are valid, or null if they are not.
   */
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Logs in the user by validating their email and password,
   * and returns a token and user object upon successful authentication.
   *
   * @param {LoginDto} data - An object containing email and password strings.
   * @return {Promise<{ user: Omit<User, 'password'>; token: string }>} An object containing a token string and user object.
   * @throws {UnauthorizedException} If the credentials are invalid.
   * @throws {HttpException} If the user account is disabled or email is not verified.
   */
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

  async register(user: any) {
    return this.usersService.create(user);
  }

  async resetPassword(data: ResetPasswordDto) {
    return data;
  }

  async confirmEmail(data: ConfirmEmailDto) {
    return data;
  }

  async updateSettings(data: UpdateSettingsDto) {
    return data;
  }

  async refresh(userId: string, { ip, userAgent }, oldToken: string) {
    return { access_token: 'new' };
  }

  /**
   * Changes the password of a user.
   *
   * @param {ChangePasswordDto} data - An object containing oldPassword and newPassword strings.
   * @param {JwtPayload} user - The user object of the user for which to change the password.
   * @return {Promise<{ success: boolean }>} An object containing a boolean indicating the success of the operation.
   * @throws {NotFoundException} If the user is not found.
   * @throws {UnauthorizedException} If the old password is invalid.
   */

  async changePassword(
    data: ChangePasswordDto,
    user: JwtPayload,
  ): Promise<{ success: boolean }> {
    const { oldPassword, newPassword } = data;
    const { id } = user;

    const where = { id };
    const select = { id: true, password: true };

    const foundUser = await this.usersService.findOne({ where, select });
    if (!foundUser) throw new NotFoundException('ERR_USER_NOT_FOUND');

    const isValid = await bcrypt.compare(oldPassword, foundUser.password);
    if (!isValid) throw new UnauthorizedException('ERR_INVALID_PASSWORD');

    foundUser.password = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.usersRepository.save(foundUser);
    if (!updatedUser)
      throw new BadRequestException('ERR_PASSWORD_UPDATE_FAILED');

    return { success: true };
  }
}
