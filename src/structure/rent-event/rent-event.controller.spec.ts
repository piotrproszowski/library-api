import { Test, TestingModule } from '@nestjs/testing';
import { RentEventController } from './rent-event.controller';

describe('RentEventController', () => {
  let controller: RentEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentEventController],
    }).compile();

    controller = module.get<RentEventController>(RentEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
