import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentParkUnitResolver } from './equipment-park-unit.resolver';

describe('EquipmentParkUnitResolver', () => {
  let resolver: EquipmentParkUnitResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentParkUnitResolver],
    }).compile();

    resolver = module.get<EquipmentParkUnitResolver>(EquipmentParkUnitResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
