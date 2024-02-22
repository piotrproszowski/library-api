import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UsersListDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  skip = 0;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  take = 10;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
