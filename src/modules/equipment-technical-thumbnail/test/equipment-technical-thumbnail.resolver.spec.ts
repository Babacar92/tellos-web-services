import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentTechnicalThumbnailResolver } from '../equipment-technical-thumbnail.resolver';

describe('EquipmentTechnicalThumbnailResolver', () => {
  let resolver: EquipmentTechnicalThumbnailResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentTechnicalThumbnailResolver],
    }).compile();

    resolver = module.get<EquipmentTechnicalThumbnailResolver>(EquipmentTechnicalThumbnailResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
