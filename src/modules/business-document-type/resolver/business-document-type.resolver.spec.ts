import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDocumentTypeResolver } from './business-document-type.resolver';

describe('BusinessDocumentTypeResolver', () => {
  let resolver: BusinessDocumentTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessDocumentTypeResolver],
    }).compile();

    resolver = module.get<BusinessDocumentTypeResolver>(BusinessDocumentTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
