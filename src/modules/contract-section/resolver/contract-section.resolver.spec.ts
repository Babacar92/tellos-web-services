import { Test, TestingModule } from '@nestjs/testing';
import { ContractSectionResolver } from './contract-section.resolver';

describe('ContractSectionResolver', () => {
  let resolver: ContractSectionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractSectionResolver],
    }).compile();

    resolver = module.get<ContractSectionResolver>(ContractSectionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
