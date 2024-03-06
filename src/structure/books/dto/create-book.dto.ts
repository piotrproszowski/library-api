import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISBN, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly title: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly author: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly description?: string;

  @ApiProperty({ required: true })
  @IsISBN()
  readonly isbn: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly price?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  readonly isActive: boolean;
}
