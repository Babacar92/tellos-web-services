import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypePaymentService } from './contract-type-payment.service';

describe('ContractTypePaymentService', () => {
  let service: ContractTypePaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractTypePaymentService],
    }).compile();

    service = module.get<ContractTypePaymentService>(ContractTypePaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
