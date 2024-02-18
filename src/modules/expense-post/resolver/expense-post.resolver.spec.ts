import { Test, TestingModule } from '@nestjs/testing';
import { ExpensePostResolver } from './expense-post.resolver';

describe('ExpensePostResolver', () => {
  let resolver:ExpensePostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpensePostResolver],
    }).compile();

    resolver = module.get<ExpensePostResolver>(ExpensePostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
