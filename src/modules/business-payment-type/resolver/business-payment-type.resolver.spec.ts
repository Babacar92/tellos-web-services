import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPaymentTypeResolver } from './business-payment-type.resolver';

describe('BusinessPaymentTypeResolver', () => {
  let resolver: BusinessPaymentTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessPaymentTypeResolver],
    }).compile();

    resolver = module.get<BusinessPaymentTypeResolver>(BusinessPaymentTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
