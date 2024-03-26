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

  /**
   * Creates a new book.
   * @param {CreateBookDto}data - The data for creating a book.
   * @returns {Promise<{ book: Book }>} The created book.
   * @throws InternalServerErrorException if there is an error creating the book.
   */
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

  /**
   * Updates a book by its ID.
   * @param {string}id - The ID of the book to update.
   * @param {UpdateBookDto}data - The data for updating the book.
   * @returns The updated book.
   * @throws NotFoundException if the book is not found.
   */
  async update(
    id: string,
    data: UpdateBookDto,
  ): Promise<{ book: UpdateResult }> {
    await this.getOne(id);
    const book = await this.booksRepository.update(id, data);
    return { book };
  }

  /**
   * Retrieves all books.
   * @returns All books.
   * @throws NotFoundException if no books are found.
   */
  async getAll() {
    const books = await this.booksRepository.find();

    return { books };
  }

  /**
   * Retrieves a book by its ID.
   * @param {string}id - The ID of the book to retrieve.
   * @returns The retrieved book.
   * @throws NotFoundException if the book is not found.
   */
  async getOne(id: string) {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return { book };
  }

  /**
   * Deletes a book by its ID.
   * @param id - The ID of the book to delete.
   * @returns The deleted book.
   * @throws InternalServerErrorException if there is an error deleting the book.
   */
  async delete(id: string) {
    const book = await this.getOne(id);

    const { affected } = await this.booksRepository.delete(id);

    if (affected === 0 || !affected) {
      throw new InternalServerErrorException('ERR_BOOK_REMOVE_FAILED');
    }
    return book;
  }

  /**
   * Changes the status of a book by its ID.
   * @param {string}id - The ID of the book to change the status of.
   * @param {}action - The action to perform on the book's status.
   * @returns The updated book.
   * @throws NotFoundException if the book is not found.
   */
  async changeStatus(id: string, action: string) {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const updatedBook = await this.booksRepository.update(id, {
      isActive: action === 'activate' ? true : false,
    });

    return { book: updatedBook };
  }
}
