import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({ required: true })
  @IsString()
  token: string;
}
