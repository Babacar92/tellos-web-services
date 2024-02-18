import { Test, TestingModule } from '@nestjs/testing';
import { SectionCodeController } from './section-code.controller';

describe('SectionCodeController', () => {
  let controller: SectionCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionCodeController],
    }).compile();

    controller = module.get<SectionCodeController>(SectionCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
