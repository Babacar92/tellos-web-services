import { Test, TestingModule } from '@nestjs/testing';
import { ExpensePostController } from './expense-post.controller';

describe('ExpensePostController', () => {
  let controller: ExpensePostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensePostController],
    }).compile();

    controller = module.get<ExpensePostController>(ExpensePostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
