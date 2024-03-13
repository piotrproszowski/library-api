import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { RentEventType } from '../entity/rent-event.entity';

export class CreateRentEventDto {
  @ApiProperty({ required: true })
  @IsEnum(RentEventType)
  readonly type: RentEventType;

  @ApiProperty({ required: true })
  @IsString()
  readonly userId: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly rentRegistryId: string;
}
