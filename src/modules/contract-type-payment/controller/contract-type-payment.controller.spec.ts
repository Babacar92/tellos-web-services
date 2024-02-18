import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypePaymentController } from './contract-type-payment.controller';

describe('ContractTypePaymentController', () => {
  let controller: ContractTypePaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractTypePaymentController],
    }).compile();

    controller = module.get<ContractTypePaymentController>(ContractTypePaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
