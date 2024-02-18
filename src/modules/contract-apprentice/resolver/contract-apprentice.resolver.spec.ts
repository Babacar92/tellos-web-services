import { Test, TestingModule } from '@nestjs/testing';
import { ContractApprenticeResolver } from './contract-apprentice.resolver';

describe('ContractApprenticeResolver', () => {
  let resolver:ContractApprenticeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractApprenticeResolver],
    }).compile();

    resolver = module.get<ContractApprenticeResolver>(ContractApprenticeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
