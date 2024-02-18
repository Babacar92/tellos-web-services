import { Test, TestingModule } from '@nestjs/testing';
import { GoodReferencePriceResolver } from './good-reference-price.resolver';

describe('GoodReferencePriceResolver', () => {
  let resolver: GoodReferencePriceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodReferencePriceResolver],
    }).compile();

    resolver = module.get<GoodReferencePriceResolver>(GoodReferencePriceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
