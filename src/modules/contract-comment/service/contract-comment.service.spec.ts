import { Test, TestingModule } from '@nestjs/testing';
import { ContractCommentService } from './contract-comment.service';

describe('ContractCommentService', () => {
  let service:ContractCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractCommentService],
    }).compile();

    service = module.get<ContractCommentService>(ContractCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
