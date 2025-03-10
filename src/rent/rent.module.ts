import { Module } from '@nestjs/common';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { BooksService } from 'src/structure/books/books.service';
import { Book } from 'src/structure/books/entity/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentEvent } from 'src/structure/rent-event/entity/rent-event.entity';

@Module({
  controllers: [RentController],
  providers: [RentService, BooksService],
  imports: [TypeOrmModule.forFeature([Book, RentEvent])],
})
export class RentModule {}
