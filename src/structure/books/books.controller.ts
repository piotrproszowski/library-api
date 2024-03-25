import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { Roles } from 'src/auth/decorators/roles.decorator';

import { UserRole } from 'src/users/enums/user-role.enum';

import { BooksService } from './books.service';

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

  @Put('/:id')
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
  changeStatus(@Param('id') id: string, @Param('action') action: string) {
    return this.booksService.changeStatus(id, action);
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
