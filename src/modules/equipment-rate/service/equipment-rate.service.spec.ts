import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentRateService } from './equipment-rate.service';

describe('EquipmentRateService', () => {
  let service: EquipmentRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentRateService],
    }).compile();

    service = module.get<EquipmentRateService>(EquipmentRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
