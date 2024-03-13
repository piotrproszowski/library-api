import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISBN, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly title: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly author: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ required: true })
  @IsISBN()
  readonly isbn: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly price?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;
}
