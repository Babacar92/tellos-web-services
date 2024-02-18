import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEquipmentResolver } from './category-equipment.resolver';

describe('CategoryEquipmentResolver', () => {
  let resolver: CategoryEquipmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryEquipmentResolver],
    }).compile();

    resolver = module.get<CategoryEquipmentResolver>(CategoryEquipmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
