import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ListRentRegistryDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  book: string;

  @ApiProperty()
  @IsString()
  rentEvents: string[];
}
