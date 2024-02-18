import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBatchStatusController } from './business-batch-status.controller';

describe('BusinessBatchStatusController', () => {
  let controller: BusinessBatchStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessBatchStatusController],
    }).compile();

    controller = module.get<BusinessBatchStatusController>(BusinessBatchStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
