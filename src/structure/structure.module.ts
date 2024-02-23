import { Module } from '@nestjs/common';
import { RentRegistryModule } from './rent-registry/rent-registry.module';
import { BooksModule } from './books/books.module';
import { RentEventService } from './rent-event/rent-event.service';
import { RentEventController } from './rent-event/rent-event.controller';
import { RentEventModule } from './rent-event/rent-event.module';
import { RentersModule } from './renters/renters.module';

@Module({
  imports: [RentRegistryModule, BooksModule, RentEventModule, RentersModule],
  providers: [RentEventService],
  controllers: [RentEventController],
})
export class StructureModule {}
