import { Test, TestingModule } from '@nestjs/testing';
import { ContractInfoResolver } from './contract-info.resolver';

describe('ContractInfoResolver', () => {
  let resolver: ContractInfoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractInfoResolver],
    }).compile();

    resolver = module.get<ContractInfoResolver>(ContractInfoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
