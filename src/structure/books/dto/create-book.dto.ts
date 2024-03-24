import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Transform(({ value }) => Number(value) || null)
  @IsNumber()
  price?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  publicationLanguage?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  originalLanguage?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || null)
  @IsNumber()
  numberOfPages?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || null)
  @IsNumber()
  editionNumber?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  releaseDate?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  publicationDate?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  format?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  coverType?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  author?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  publisher?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || null)
  @IsNumber()
  height?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Transform(({ value }) => parseInt(value) || null)
  @IsNumber()
  width?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || null)
  @IsNumber()
  depth?: number | null;

  @ApiProperty({ required: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  isbn?: string | null;
}
