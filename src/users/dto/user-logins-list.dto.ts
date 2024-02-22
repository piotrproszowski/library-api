import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserLoginsListDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  skip = 0;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  take = 10;
}
