import { Injectable } from '@nestjs/common';
import { RentEvent } from './entity/rent-event.entity';
import { CreateRentEventDto } from './dto/create-rent-event.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RentEventService {
  constructor(
    @InjectRepository(RentEvent)
    private readonly rentEventRepository: RentEvent,
  ) {}

  async create(rentEvent: CreateRentEventDto) {
    return this.rentEventRepository.save(rentEvent);
  }

  async findAll() {
    return this.rentEventRepository.find();
  }

  async findOne(id: string) {
    return this.rentEventRepository.find({ id });
  }

  async update(id: string) {
    return this.rentEventRepository.update({ id });
  }

  async remove(id: string) {
    return this.rentEventRepository.delete({ id });
  }

  async findUserRentEvents(userId: string) {
    return this.rentEventRepository.find({ where: { user: userId } });
  }
}
