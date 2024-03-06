import { Module, forwardRef } from '@nestjs/common';

import { RentEventService } from './rent-event/rent-event.service';
import { RentEventController } from './rent-event/rent-event.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { RentRegistry } from './rent-registry/entity/rent-registry.entity';
import { Book } from './books/entity/book.entity';
import { RentEvent } from './rent-event/entity/rent-event.entity';
import { Renter } from './renters/entity/renter.entity';
import { RentRegistryController } from './rent-registry/rent-registry.controller';
import { BooksController } from './books/books.controller';
import { RentersController } from './renters/renters.controller';
import { RentRegistryService } from './rent-registry/rent-registry.service';
import { BooksService } from './books/books.service';
import { RentersService } from './renters/renters.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentRegistry, Book, RentEvent, Renter]),
    forwardRef(() => UsersModule),
  ],
  controllers: [
    RentRegistryController,
    BooksController,
    RentEventController,
    RentersController,
  ],
  providers: [
    RentRegistryService,
    RentEventService,
    BooksService,
    RentersService,
  ],
  exports: [TypeOrmModule],
})
export class StructureModule {}
