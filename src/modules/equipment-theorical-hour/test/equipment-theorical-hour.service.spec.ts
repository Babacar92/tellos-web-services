import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentTheoricalHourService } from '../equipment-theorical-hour.service';

describe('EquipmentTheoricalHourService', () => {
  let service: EquipmentTheoricalHourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentTheoricalHourService],
    }).compile();

    service = module.get<EquipmentTheoricalHourService>(EquipmentTheoricalHourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
