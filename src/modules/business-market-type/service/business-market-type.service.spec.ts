import { Test, TestingModule } from '@nestjs/testing';
import { BusinessMarketTypeService } from './business-market-type.service';

describe('BusinessMarketTypeService', () => {
  let service: BusinessMarketTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessMarketTypeService],
    }).compile();

    service = module.get<BusinessMarketTypeService>(BusinessMarketTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
