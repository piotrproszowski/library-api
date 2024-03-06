import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entity/book.entity';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = await this.booksRepository.save(createBookDto);

    if (!book) {
      throw new InternalServerErrorException('Error creating book');
    }

    return { book };
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.booksRepository.update(id, updateBookDto);

    return { book: { ...book, ...updateBookDto } };
  }

  async getAll() {
    const books = await this.booksRepository.find();

    if (!books) {
      throw new NotFoundException('Books not found');
    }

    return { books };
  }

  async getOne(id: string) {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return { book };
  }

  async delete(id: string) {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const deletedBook = await this.booksRepository.delete(id);

    return { deletedBook };
  }

  async changeStatus(id: string, action: string) {
    // const book = await this.booksRepository.findOneBy({ id });

    // if (!book) {
    //   throw new NotFoundException('Book not found');
    // }

    // const updatedBook = await this.booksRepository.update(id, {
    //   isActive: action === 'activate' ? true : false,
    // });

    return { id, action };
  }
}
