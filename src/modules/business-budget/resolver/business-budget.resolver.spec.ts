import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBudgetResolver } from './business-budget.resolver';

describe('BusinessBudgetResolver', () => {
  let resolver: BusinessBudgetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessBudgetResolver],
    }).compile();

    resolver = module.get<BusinessBudgetResolver>(BusinessBudgetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
