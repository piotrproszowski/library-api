import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UserActivationDto {
  @ApiProperty({ required: true })
  @IsBoolean()
  readonly active: boolean;
}
