import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBatchStatusResolver } from './business-batch-status.resolver';

describe('BusinessBatchStatusResolver', () => {
  let resolver: BusinessBatchStatusResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessBatchStatusResolver],
    }).compile();

    resolver = module.get<BusinessBatchStatusResolver>(BusinessBatchStatusResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
