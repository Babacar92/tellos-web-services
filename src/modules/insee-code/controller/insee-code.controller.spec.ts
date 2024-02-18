import { Test, TestingModule } from '@nestjs/testing';
import { InseeCodeController } from './insee-code.controller';

describe('InseeCodeController', () => {
  let controller: InseeCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InseeCodeController],
    }).compile();

    controller = module.get<InseeCodeController>(InseeCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
