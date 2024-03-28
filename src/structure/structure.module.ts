import { Module, forwardRef } from '@nestjs/common';

import { RentEventService } from './rent-event/rent-event.service';
import { RentEventController } from './rent-event/rent-event.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Book } from './books/entity/book.entity';
import { RentEvent } from './rent-event/entity/rent-event.entity';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, RentEvent]),
    forwardRef(() => UsersModule),
  ],
  controllers: [BooksController, RentEventController],
  providers: [RentEventService, BooksService],
  exports: [TypeOrmModule],
})
export class StructureModule {}
