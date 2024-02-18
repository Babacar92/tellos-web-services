import { Test, TestingModule } from '@nestjs/testing';
import { WorkforceRateResolver } from './workforce-rate.resolver';

describe('WorkforceRateResolver', () => {
  let resolver: WorkforceRateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkforceRateResolver],
    }).compile();

    resolver = module.get<WorkforceRateResolver>(WorkforceRateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
