import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDocumentResolver } from './business-document.resolver';

describe('BusinessDocumentResolver', () => {
  let resolver: BusinessDocumentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessDocumentResolver],
    }).compile();

    resolver = module.get<BusinessDocumentResolver>(BusinessDocumentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
