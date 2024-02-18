import { Test, TestingModule } from '@nestjs/testing';
import { BusinessMarketTypeResolver } from './business-market-type.resolver';

describe('BusinessMarketTypeResolver', () => {
  let resolver: BusinessMarketTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessMarketTypeResolver],
    }).compile();

    resolver = module.get<BusinessMarketTypeResolver>(BusinessMarketTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
