import { Test, TestingModule } from '@nestjs/testing';
import { StockPileService } from '../stock-pile.service';

describe('StockPileService', () => {
  let service: StockPileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockPileService],
    }).compile();

    service = module.get<StockPileService>(StockPileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
