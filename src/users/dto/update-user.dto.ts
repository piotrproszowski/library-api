import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsEnum(UserRole)
  @IsOptional()
  readonly role?: UserRole;
}
