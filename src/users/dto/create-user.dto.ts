import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly email: string;

  @ApiProperty({ required: false })
  @IsEnum(UserRole)
  @IsOptional()
  readonly role?: UserRole;
}
