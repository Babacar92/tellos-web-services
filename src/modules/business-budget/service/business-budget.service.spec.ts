import { Test, TestingModule } from '@nestjs/testing';
import { BusinessBudgetService } from './business-budget.service';

describe('BusinessBudgetService', () => {
  let service: BusinessBudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessBudgetService],
    }).compile();

    service = module.get<BusinessBudgetService>(BusinessBudgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
