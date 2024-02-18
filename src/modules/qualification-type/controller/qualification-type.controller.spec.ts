import { Test, TestingModule } from '@nestjs/testing';
import { QualificationTypeController } from './qualification-type.controller';

describe('QualificationTypeController', () => {
  let controller: QualificationTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualificationTypeController],
    }).compile();

    controller = module.get<QualificationTypeController>(QualificationTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
