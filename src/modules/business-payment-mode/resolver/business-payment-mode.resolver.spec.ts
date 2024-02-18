import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPaymentModeResolver } from './business-payment-mode.resolver';

describe('BusinessPaymentModeResolver', () => {
  let resolver: BusinessPaymentModeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessPaymentModeResolver],
    }).compile();

    resolver = module.get<BusinessPaymentModeResolver>(BusinessPaymentModeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
