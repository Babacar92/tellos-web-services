import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPaymentModeController } from './business-payment-mode.controller';

describe('BusinessPaymentModeController', () => {
  let controller: BusinessPaymentModeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessPaymentModeController],
    }).compile();

    controller = module.get<BusinessPaymentModeController>(BusinessPaymentModeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
