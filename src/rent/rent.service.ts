import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/structure/books/books.service';
import { Book } from 'src/structure/books/entity/book.entity';
import { RentEvent } from 'src/structure/rent-event/entity/rent-event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RentService {
  constructor(
    private readonly booksService: BooksService,

    @InjectRepository(Book)
    private booksRepository: Repository<Book>,

    @InjectRepository(RentEvent)
    private rentRepository: Repository<RentEvent>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async changeBookStatus(id: string, data: any): Promise<{ book: Book }> {
    const { book } = await this.booksService.getOne(id);
    return { book };
  }
}
