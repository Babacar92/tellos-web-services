import { Test, TestingModule } from '@nestjs/testing';
import { BusinessMarketTypeController } from './business-market-type.controller';

describe('BusinessMarketTypeController', () => {
  let controller: BusinessMarketTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessMarketTypeController],
    }).compile();

    controller = module.get<BusinessMarketTypeController>(BusinessMarketTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
