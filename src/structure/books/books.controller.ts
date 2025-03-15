import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  BadRequestException,
} from '@nestjs/common';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { Roles } from 'src/auth/decorators/roles.decorator';

import { UserRole } from 'src/users/enums/user-role.enum';

import { BooksService } from './books.service';
import { BookAction } from './enums/book-action.enum';

@ApiBearerAuth()
@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('/')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  create(@Body() data: CreateBookDto) {
    return this.booksService.create(data);
  }

  @Patch('/:id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() data: UpdateBookDto) {
    return this.booksService.update(id, data);
  }

  @Put('/:id/:action')
  @Roles(
    UserRole.ADMIN,
    UserRole.EMPLOYEE,
    UserRole.SUPER_ADMIN,
    UserRole.CLIENT,
  )
  async performAction(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('action', new ParseEnumPipe(BookAction)) action: BookAction,
  ) {
    const { book } = await this.booksService.getOne(id);

    switch (action) {
      case BookAction.RESERVE:
        return { message: 'Book reserved', book };
      case BookAction.BORROW:
        return { message: 'Book borrowed', book };
      case BookAction.RETURN:
        return { message: 'Book returned', book };
      case BookAction.CANCEL:
        return { message: 'Reservation cancelled', book };
      default:
        throw new BadRequestException('Invalid action');
    }
  }

  @Get('/')
  getAll() {
    return this.booksService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.booksService.getOne(id);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.booksService.delete(id);
  }
}
