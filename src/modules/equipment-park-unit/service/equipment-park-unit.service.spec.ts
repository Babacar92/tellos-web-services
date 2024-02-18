import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentParkUnitService } from './equipment-park-unit.service';

describe('EquipmentParkUnitService', () => {
  let service: EquipmentParkUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentParkUnitService],
    }).compile();

    service = module.get<EquipmentParkUnitService>(EquipmentParkUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
