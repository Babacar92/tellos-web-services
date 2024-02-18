import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPaymentTypeController } from './business-payment-type.controller';

describe('BusinessPaymentTypeController', () => {
  let controller: BusinessPaymentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessPaymentTypeController],
    }).compile();

    controller = module.get<BusinessPaymentTypeController>(BusinessPaymentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
