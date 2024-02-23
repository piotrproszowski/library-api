import { Test, TestingModule } from '@nestjs/testing';
import { RentRegistryController } from './rent-registry.controller';

describe('RentRegistryController', () => {
  let controller: RentRegistryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentRegistryController],
    }).compile();

    controller = module.get<RentRegistryController>(RentRegistryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
