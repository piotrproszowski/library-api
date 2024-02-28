import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserLogin } from './entities/user-login.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserLogin)
    private userLoginsRepository: Repository<UserLogin>,
  ) {}

  async findOneUser(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    withPassword = false,
  ) {
    const query = this.usersRepository.createQueryBuilder('user').select();

    query.where(where);
    query.leftJoinAndMapOne(
      'user.login',
      UserLogin,
      'login',
      'login."userId" = user.id',
    );
    query.andWhere(
      (query) =>
        `(login.id = ${query
          .subQuery()
          .select('id')
          .from(UserLogin, 'login')
          .where('login."userId" = user.id')
          .orderBy('login.updatedAt', 'DESC')
          .orderBy('login.createdAt', 'DESC')
          .limit(1)
          .getQuery()} OR login.id IS NULL)`,
    );

    if (withPassword) {
      query.addSelect('user.password');
    }
    const user = await query.getOne();

    return { user };
  }
}
