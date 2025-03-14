import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { Book } from './entity/book.entity';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(data: CreateBookDto): Promise<{ book: Book }> {
    const bookData: DeepPartial<Book> = {
      ...data,
      price: data.price,
    };
    const book = await this.booksRepository.save(bookData);
    if (!book) {
      throw new InternalServerErrorException('ERR_BOOK_CREATE_FAILED');
    }
    return { book };
  }

  async update(
    id: string,
    data: UpdateBookDto,
  ): Promise<{ book: UpdateResult }> {
    await this.getOne(id);
    const book = await this.booksRepository.update(id, data);
    return { book };
  }

  async getAll() {
    const books = await this.booksRepository.find();

    return { books };
  }

  async getOne(id: string): Promise<{ book: Book }> {
    const book = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.rentEvents', 'rentEvents')
      .orderBy('rentEvents.createdAt', 'DESC')
      .where('book.id = :id', { id })
      .getOne();

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return { book };
  }

  async delete(id: string) {
    const book = await this.getOne(id);

    const { affected } = await this.booksRepository.delete(id);

    if (affected === 0 || !affected) {
      throw new InternalServerErrorException('ERR_BOOK_REMOVE_FAILED');
    }
    return book;
  }
}
