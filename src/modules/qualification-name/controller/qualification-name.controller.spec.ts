import { Test, TestingModule } from '@nestjs/testing';
import { QualificationNameController } from './qualification-name.controller';

describe('QualificationNameController', () => {
  let controller: QualificationNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualificationNameController],
    }).compile();

    controller = module.get<QualificationNameController>(QualificationNameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
