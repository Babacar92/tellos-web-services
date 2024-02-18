import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentTechnicalThumbnailService } from '../equipment-technical-thumbnail.service';

describe('EquipmentTechnicalThumbnailService', () => {
  let service: EquipmentTechnicalThumbnailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentTechnicalThumbnailService],
    }).compile();

    service = module.get<EquipmentTechnicalThumbnailService>(EquipmentTechnicalThumbnailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
