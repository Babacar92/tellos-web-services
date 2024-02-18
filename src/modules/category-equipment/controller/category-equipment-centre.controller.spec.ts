import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEquipmentController } from './category-equipment.controller';

describe('CategoryEquipmentController', () => {
  let controller: CategoryEquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryEquipmentController],
    }).compile();

    controller = module.get<CategoryEquipmentController>(CategoryEquipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
