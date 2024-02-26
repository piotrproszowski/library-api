import {
  BadRequestException,
  ConflictException,
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
import { RegisterDto } from './dto/register.dto';

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

  /**
   *
   * @param {string} token - The confirmation code token to validate.
   * @param {ConfirmationCodeType} type - The type of the confirmation code.
   * @returns {string} - generated confirmation link
   */

  createConfirmationLink(token: string, type: ConfirmationCodeType): string {
    const createdUrl = new URL('', this.configService.get('app.baseUrl'));

    switch (type) {
      case ConfirmationCodeType.EMAIL_VERIFICATION:
        createdUrl.pathname = '/auth/confirm-reset-password';
        break;
      case ConfirmationCodeType.PASSWORD_RESET:
        createdUrl.pathname = '/auth/confirm-email';
        break;
      default:
        throw new Error('Invalid confirmation code type');
    }

    createdUrl.searchParams.set('token', token);

    return createdUrl.toString();
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

  /**
   * Registers a new user with the given data, hashes their password,
   * creates a confirmation code, and sends a confirmation email.
   *
   * @async
   * @param {RegisterDto} data - The user's registration data.
   * @throws {ConflictException} If a user with the given email already exists.
   * @throws {BadRequestException} If registration fails for any reason.
   * @return {Promise<{ user: User }>} An object containing the registered user.
   */

  async register(data: RegisterDto): Promise<{ user: User }> {
    const { name, email, password: rawPassword } = data;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) throw new ConflictException('ERR_USER_ALREADY_EXISTS');

    const password = await bcrypt.hash(rawPassword, 10);

    const userData = this.usersRepository.create({
      name,
      email,
      password,
    });
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
        subject: 'Rejestracja konta eSECS',
        template: 'confirm-registration',
        context: {
          preheader: 'Dziękujemy za rejestrację w systemie eSECS!',
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

  async resetPassword(data: ResetPasswordDto) {
    return data;
  }

  async confirmEmail(data: ConfirmEmailDto) {
    return data;
  }

  async updateSettings(data: UpdateSettingsDto) {
    return data;
  }

  /**
   * Refreshes the user token.
   *
   * @param {string} id - the user id.
   * @return {Promise<{ user: Omit<User, 'password'>, token: string }>} Object containing updated user object and token string.
   * @throws {UnauthorizedException} If user is not found.
   */

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
