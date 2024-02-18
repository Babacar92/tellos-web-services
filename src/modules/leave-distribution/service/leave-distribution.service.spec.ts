import { Test, TestingModule } from '@nestjs/testing';
import { LeaveDistributionService } from './leave-distribution.service';

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
