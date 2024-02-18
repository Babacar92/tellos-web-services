import { Test, TestingModule } from '@nestjs/testing';
import { WorkforceRateService } from './workforce-rate.service';

describe('WorkforceRateService', () => {
  let service: WorkforceRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkforceRateService],
    }).compile();

    service = module.get<WorkforceRateService>(WorkforceRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
