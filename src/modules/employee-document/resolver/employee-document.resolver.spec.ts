import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDocumentResolver } from './employee-document.resolver';

describe('EmployeeDocumentResolver', () => {
  let resolver: EmployeeDocumentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDocumentResolver],
    }).compile();

    resolver = module.get<EmployeeDocumentResolver>(EmployeeDocumentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
