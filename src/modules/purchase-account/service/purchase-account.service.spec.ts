import { Test, TestingModule } from '@nestjs/testing';
import { LeaveDistributionService } from './purchase-account.service';

describe('LeaveDistributionService', () => {
  let service: LeaveDistributionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveDistributionService],
    }).compile();

    service = module.get<LeaveDistributionService>(LeaveDistributionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
