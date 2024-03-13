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

  /**
   * Creates a new book.
   * @param createBookDto - The data for creating a book.
   * @returns The created book.
   * @throws InternalServerErrorException if there is an error creating the book.
   */
  async create(createBookDto: CreateBookDto) {
    const book = await this.booksRepository.save(createBookDto);

    if (!book) {
      throw new InternalServerErrorException('Error creating book');
    }

    return { book };
  }

  /**
   * Updates a book by its ID.
   * @param id - The ID of the book to update.
   * @param updateBookDto - The data for updating the book.
   * @returns The updated book.
   * @throws NotFoundException if the book is not found.
   */
  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.booksRepository.update(id, updateBookDto);

    return { book: { ...book, ...updateBookDto } };
  }

  /**
   * Retrieves all books.
   * @returns All books.
   * @throws NotFoundException if no books are found.
   */
  async getAll() {
    const books = await this.booksRepository.find();

    if (!books) {
      throw new NotFoundException('Books not found');
    }

    return { books };
  }

  /**
   * Retrieves a book by its ID.
   * @param id - The ID of the book to retrieve.
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
   * @throws NotFoundException if the book is not found.
   */
  async delete(id: string) {
    const book = await this.booksRepository.findOneBy({ id });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const deletedBook = await this.booksRepository.delete(id);

    return { deletedBook };
  }

  /**
   * Changes the status of a book by its ID.
   * @param id - The ID of the book to change the status of.
   * @param action - The action to perform on the book's status.
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
