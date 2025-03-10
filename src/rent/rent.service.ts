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

  /**
   * Changes the status of a book.
   * @param {string} id - The ID of the book to change the status of.
   * @param {any} data - The data for changing the status of the book.
   * @returns {Promise<{book:Book}> }The updated book.
   */
  async changeBookStatus(id: string, data: any): Promise<{ book: Book }> {
    const { book } = await this.booksService.getOne(id);
    console.log(data);
    return { book };
  }
}
