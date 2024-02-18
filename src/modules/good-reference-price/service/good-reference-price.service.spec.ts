import { Test, TestingModule } from '@nestjs/testing';
import { GoodReferencePriceService } from './good-reference-price.service';

describe('GoodReferencePriceService', () => {
  let service: GoodReferencePriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodReferencePriceService],
    }).compile();

    service = module.get<GoodReferencePriceService>(GoodReferencePriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
