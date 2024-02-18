import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentTheoricalHourResolver } from '../equipment-theorical-hour.resolver';

describe('EquipmentTheoricalHourResolver', () => {
  let resolver: EquipmentTheoricalHourResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentTheoricalHourResolver],
    }).compile();

    resolver = module.get<EquipmentTheoricalHourResolver>(EquipmentTheoricalHourResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
