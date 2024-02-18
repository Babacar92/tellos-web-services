import { Test, TestingModule } from '@nestjs/testing';
import { EarnedLeaveService } from './leave-period.service';

describe('EarnedLeaveService', () => {
  let service: EarnedLeaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarnedLeaveService],
    }).compile();

    service = module.get<EarnedLeaveService>(EarnedLeaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
