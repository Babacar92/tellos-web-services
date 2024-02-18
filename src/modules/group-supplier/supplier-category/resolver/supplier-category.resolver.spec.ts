import { Test, TestingModule } from '@nestjs/testing';
import { SupplierCategoryResolver } from './supplier-category.resolver';

describe('SupplierCategoryResolver', () => {
  let resolver: SupplierCategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierCategoryResolver],
    }).compile();

    resolver = module.get<SupplierCategoryResolver>(SupplierCategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
