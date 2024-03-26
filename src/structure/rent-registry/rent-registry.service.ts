import { Injectable } from '@nestjs/common';
import { CreateRentRegistryDto } from './dto/create-rent-registry.dto';
import { RentRegistry } from './entity/rent-registry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRentRegistryDto } from './dto/update-rent-registry.dto';
import { ListRentRegistryDto } from './dto/list-rent-registry.dto';

@Injectable()
export class RentRegistryService {
  constructor(
    @InjectRepository(RentRegistry)
    private rentRegistryRepository: Repository<RentRegistry>,
  ) {}
  async create(data: CreateRentRegistryDto) {
    const rentRegistry = await this.rentRegistryRepository.save(data);

    return rentRegistry;
  }

  getAll(data: ListRentRegistryDto) {
    console.log('data', data);
    return 'This action returns all rent-registry';
  }

  getOne(id: string) {
    console.log('id', id);
    return 'This action returns a #rent-registry';
  }

  update(id: string, data: UpdateRentRegistryDto) {
    console.log('id', id);
    console.log('data', data);
    return 'This action updates a #rent-registry';
  }
  delete(id: string) {
    console.log('id', id);
    return 'This action removes a #rent-registry';
  }
}
