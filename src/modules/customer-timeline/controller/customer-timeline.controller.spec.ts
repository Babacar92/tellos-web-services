import { Test, TestingModule } from '@nestjs/testing';
import { CustomerTimelineController } from './customer-timeline.controller';

describe('CustomerTimelineController', () => {
  let controller: CustomerTimelineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerTimelineController],
    }).compile();

    controller = module.get<CustomerTimelineController>(CustomerTimelineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
