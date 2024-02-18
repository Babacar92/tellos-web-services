import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypeEntryResolver } from './contract-type-entry.resolver';

describe('ContractTypeEntryResolver', () => {
  let resolver:ContractTypeEntryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractTypeEntryResolver],
    }).compile();

    resolver = module.get<ContractTypeEntryResolver>(ContractTypeEntryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
