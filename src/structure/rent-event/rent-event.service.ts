import { Injectable } from '@nestjs/common';
import { RentEvent } from './entity/rent-event.entity';
import { CreateRentEventDto } from './dto/create-rent-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRentEventDto } from './dto/update-rent-event.dto';

@Injectable()
export class RentEventService {
  constructor(
    @InjectRepository(RentEvent)
    private readonly rentEventRepo: Repository<RentEvent>,
  ) {}

  async create(data: CreateRentEventDto) {
    return await this.rentEventRepo.save(data);
  }

  async findAll() {
    return this.rentEventRepo.find();
  }

  async findOne(id: string) {
    return this.rentEventRepo.findOneBy({ id });
  }

  async update(id: string, data: UpdateRentEventDto) {
    return this.rentEventRepo.update({ id }, data);
  }

  async remove(id: string) {
    return this.rentEventRepo.delete({ id });
  }
}
