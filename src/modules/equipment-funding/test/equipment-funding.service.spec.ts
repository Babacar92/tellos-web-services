import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentFundingService } from '../equipment-funding.service';

describe('EquipmentFundingService', () => {
  let service: EquipmentFundingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentFundingService],
    }).compile();

    service = module.get<EquipmentFundingService>(EquipmentFundingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
