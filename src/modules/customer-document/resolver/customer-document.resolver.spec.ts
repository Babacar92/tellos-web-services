import { Test, TestingModule } from '@nestjs/testing';
import { CustomerDocumentResolver } from './customer-document.resolver';

describe('CustomerDocumentResolver', () => {
  let resolver: CustomerDocumentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerDocumentResolver],
    }).compile();

    resolver = module.get<CustomerDocumentResolver>(CustomerDocumentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
