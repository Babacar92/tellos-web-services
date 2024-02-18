import { Test, TestingModule } from '@nestjs/testing';
import { ContractCommentResolver } from './contract-comment.resolver';

describe('ContractCommentResolver', () => {
  let resolver: ContractCommentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractCommentResolver],
    }).compile();

    resolver = module.get<ContractCommentResolver>(ContractCommentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
