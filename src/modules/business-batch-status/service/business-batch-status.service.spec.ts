import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBatchStatusService } from './business-batch-status.service';

describe('BusinessBatchStatusService', () => {
  let service: BusinessBatchStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessBatchStatusService],
    }).compile();

    service = module.get<BusinessBatchStatusService>(BusinessBatchStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
