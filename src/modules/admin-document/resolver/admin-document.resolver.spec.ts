import { Test, TestingModule } from '@nestjs/testing';
import { AdminDocumentResolver } from './admin-document.resolver';

describe('AdminDocumentResolver', () => {
  let resolver: AdminDocumentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminDocumentResolver],
    }).compile();

    resolver = module.get<AdminDocumentResolver>(AdminDocumentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
