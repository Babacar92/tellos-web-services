import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDocumentClassificationService } from './business-document-classification.service';

describe('BusinessDocumentClassificationService', () => {
  let service: BusinessDocumentClassificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessDocumentClassificationService],
    }).compile();

    service = module.get<BusinessDocumentClassificationService>(BusinessDocumentClassificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
