import { Test, TestingModule } from '@nestjs/testing';
import { RentEventService } from './rent-event.service';

describe('RentEventService', () => {
  let service: RentEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentEventService],
    }).compile();

    service = module.get<RentEventService>(RentEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
