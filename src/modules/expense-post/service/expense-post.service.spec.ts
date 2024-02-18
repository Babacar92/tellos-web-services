import { Test, TestingModule } from '@nestjs/testing';
import { ExpensePostService } from './expense-post.service';

describe('ExpensePostService', () => {
  let service: ExpensePostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpensePostService],
    }).compile();

    service = module.get<ExpensePostService>(ExpensePostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
