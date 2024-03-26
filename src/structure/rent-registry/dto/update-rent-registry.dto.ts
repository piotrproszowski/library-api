import { PartialType } from '@nestjs/swagger';
import { CreateRentRegistryDto } from './create-rent-registry.dto';

export class UpdateRentRegistryDto extends PartialType(CreateRentRegistryDto) {}
