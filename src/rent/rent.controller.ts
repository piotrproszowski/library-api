import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { RentService } from './rent.service';

@ApiBearerAuth()
@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Patch()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.SUPER_ADMIN)
  changeBookStatus(@Param('id') id: string, @Body() data) {
    return this.rentService.changeBookStatus(id, data);
  }
}
