import { Test, TestingModule } from '@nestjs/testing';
import { ContractLevelResolver } from './contract-level.resolver';

describe('ContractLevelResolver', () => {
  let resolver:ContractLevelResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractLevelResolver],
    }).compile();

    resolver = module.get<ContractLevelResolver>(ContractLevelResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
