import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmResetPasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  token: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;
}
