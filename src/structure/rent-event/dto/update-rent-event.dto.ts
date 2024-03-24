import { PartialType } from '@nestjs/swagger';
import { CreateRentEventDto } from './create-rent-event.dto';

export class UpdateRentEventDto extends PartialType(CreateRentEventDto) {}
