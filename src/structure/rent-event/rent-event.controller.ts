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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RentEventService } from './rent-event.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { CreateRentEventDto } from './dto/create-rent-event.dto';
import { UpdateRentEventDto } from './dto/update-rent-event.dto';

@ApiBearerAuth()
@ApiTags('rent-event')
@Controller('rent-event')
export class RentEventController {
  constructor(private readonly rentEventService: RentEventService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  create(@Body() data: CreateRentEventDto) {
    return this.rentEventService.create(data);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  findAll() {
    return this.rentEventService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.rentEventService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: UpdateRentEventDto,
  ) {
    return this.rentEventService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.rentEventService.remove(id);
  }
}
