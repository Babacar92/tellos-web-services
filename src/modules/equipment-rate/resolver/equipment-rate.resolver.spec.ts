import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentRateResolver } from './equipment-rate.resolver';

describe('EquipmentRateResolver', () => {
  let resolver: EquipmentRateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentRateResolver],
    }).compile();

    resolver = module.get<EquipmentRateResolver>(EquipmentRateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
