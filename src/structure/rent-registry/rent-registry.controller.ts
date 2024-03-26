import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RentRegistryService } from './rent-registry.service';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateRentRegistryDto } from './dto/create-rent-registry.dto';
import { UpdateRentRegistryDto } from './dto/update-rent-registry.dto';
import { ListRentRegistryDto } from './dto/list-rent-registry.dto';

@ApiBearerAuth()
@ApiTags('rent-registry')
@Controller('rent-registry')
export class RentRegistryController {
  constructor(private readonly rentRegistryService: RentRegistryService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  async create(@Body() data: CreateRentRegistryDto) {
    return this.rentRegistryService.create(data);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  getAll(@Query() data: ListRentRegistryDto) {
    return this.rentRegistryService.getAll(data);
  }

  @Get('/:id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  getOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.rentRegistryService.getOne(id);
  }

  @Patch('/:id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: UpdateRentRegistryDto,
  ) {
    return this.rentRegistryService.update(id, data);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.rentRegistryService.delete(id);
  }
}
