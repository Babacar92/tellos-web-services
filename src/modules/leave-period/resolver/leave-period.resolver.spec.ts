import { Test, TestingModule } from '@nestjs/testing';
import { EarnedLeaveResolver } from './leave-period.resolver';

describe('EarnedLeaveResolver', () => {
  let resolver: EarnedLeaveResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarnedLeaveResolver],
    }).compile();

    resolver = module.get<EarnedLeaveResolver>(EarnedLeaveResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
