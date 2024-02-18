import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDocumentClassificationResolver } from './business-document-classification.resolver';

describe('BusinessDocumentClassificationResolver', () => {
  let resolver: BusinessDocumentClassificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessDocumentClassificationResolver],
    }).compile();

    resolver = module.get<BusinessDocumentClassificationResolver>(BusinessDocumentClassificationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
