import { Test, TestingModule } from '@nestjs/testing';
import { CustomerContactService } from './customer-contact.service';

describe('CustomerContactService', () => {
  let service: CustomerContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerContactService],
    }).compile();

    service = module.get<CustomerContactService>(CustomerContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
