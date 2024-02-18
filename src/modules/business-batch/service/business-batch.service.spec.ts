import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBatchService } from './business-batch.service';

describe('BusinessBatchService', () => {
  let service: BusinessBatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessBatchService],
    }).compile();

    service = module.get<BusinessBatchService>(BusinessBatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
