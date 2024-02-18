import { Test, TestingModule } from '@nestjs/testing';
import { RegulationCodeController } from './regulation-code.controller';

describe('RegulationCodeController', () => {
  let controller: RegulationCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegulationCodeController],
    }).compile();

    controller = module.get<RegulationCodeController>(RegulationCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
