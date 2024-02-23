import { Module } from '@nestjs/common';
import { RentRegistryController } from './rent-registry.controller';
import { RentRegistryService } from './rent-registry.service';

@Module({
  controllers: [RentRegistryController],
  providers: [RentRegistryService]
})
export class RentRegistryModule {}
