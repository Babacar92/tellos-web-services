import { Test, TestingModule } from '@nestjs/testing';
import { CustomerDocumentService } from './customer-document.service';

describe('CustomerDocumentService', () => {
  let service: CustomerDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerDocumentService],
    }).compile();

    service = module.get<CustomerDocumentService>(CustomerDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
