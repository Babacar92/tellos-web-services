import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDocumentTypeService } from './business-document-type.service';

describe('BusinessDocumentTypeService', () => {
  let service: BusinessDocumentTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessDocumentTypeService],
    }).compile();

    service = module.get<BusinessDocumentTypeService>(BusinessDocumentTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
