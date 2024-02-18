import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPaymentModeService } from './business-payment-mode.service';

describe('BusinessPaymentModeService', () => {
  let service: BusinessPaymentModeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessPaymentModeService],
    }).compile();

    service = module.get<BusinessPaymentModeService>(BusinessPaymentModeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
