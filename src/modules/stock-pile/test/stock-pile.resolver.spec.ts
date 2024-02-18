import { Test, TestingModule } from '@nestjs/testing';
import { StockPileResolver } from '../stock-pile.resolver';

describe('EquipmentFundingResolver', () => {
  let resolver: StockPileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockPileResolver],
    }).compile();

    resolver = module.get<StockPileResolver>(StockPileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
