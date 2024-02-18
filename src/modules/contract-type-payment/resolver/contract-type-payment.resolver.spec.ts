import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypePaymentResolver } from './contract-type-payment.resolver';

describe('ContractTypePaymentResolver', () => {
  let resolver:ContractTypePaymentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractTypePaymentResolver],
    }).compile();

    resolver = module.get<ContractTypePaymentResolver>(ContractTypePaymentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
