import { Test, TestingModule } from '@nestjs/testing';
import { CustomerContactResolver } from './customer-contact.resolver';

describe('CustomerContactResolver', () => {
  let resolver: CustomerContactResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerContactResolver],
    }).compile();

    resolver = module.get<CustomerContactResolver>(CustomerContactResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
