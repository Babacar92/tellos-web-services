import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPaymentTypeService } from './business-payment-type.service';

describe('BusinessPaymentTypeService', () => {
  let service: BusinessPaymentTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessPaymentTypeService],
    }).compile();

    service = module.get<BusinessPaymentTypeService>(BusinessPaymentTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
