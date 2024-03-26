import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRentRegistryDto {
  @ApiProperty({ required: true })
  @IsString()
  bookId: string;

  @ApiProperty({ required: true })
  @IsString()
  userId: string;
}
