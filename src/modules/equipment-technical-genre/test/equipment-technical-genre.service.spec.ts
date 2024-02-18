import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentTechnicalGenreService } from '../equipment-technical-genre.service';

describe('EquipmentTechnicalGenreService', () => {
  let service: EquipmentTechnicalGenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentTechnicalGenreService],
    }).compile();

    service = module.get<EquipmentTechnicalGenreService>(EquipmentTechnicalGenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
