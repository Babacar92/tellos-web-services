import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEquipmentService } from './category-equipment.service';

describe('CategoryEquipmentService', () => {
  let service: CategoryEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryEquipmentService],
    }).compile();

    service = module.get<CategoryEquipmentService>(CategoryEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
