import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBatchResolver } from './business-batch.resolver';

describe('BusinessBatchResolver', () => {
  let resolver: BusinessBatchResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessBatchResolver],
    }).compile();

    resolver = module.get<BusinessBatchResolver>(BusinessBatchResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
