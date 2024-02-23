import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserLogin } from './entities/user-login.entity';
import { StructureModule } from 'src/structure/structure.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLogin]),
    forwardRef(() => StructureModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
