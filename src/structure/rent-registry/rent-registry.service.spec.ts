import { Test, TestingModule } from '@nestjs/testing';
import { RentRegistryService } from './rent-registry.service';

describe('RentRegistryService', () => {
  let service: RentRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentRegistryService],
    }).compile();

    service = module.get<RentRegistryService>(RentRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
