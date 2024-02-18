import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentTechnicalGenreResolver } from '../equipment-technical-genre.resolver';

describe('EquipmentTechnicalGenreResolver', () => {
  let resolver: EquipmentTechnicalGenreResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentTechnicalGenreResolver],
    }).compile();

    resolver = module.get<EquipmentTechnicalGenreResolver>(EquipmentTechnicalGenreResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
