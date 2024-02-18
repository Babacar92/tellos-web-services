import { Test, TestingModule } from '@nestjs/testing';
import { ParagraphFrameController } from './paragraph-frame.controller';

describe('ParagraphFrameController', () => {
  let controller: ParagraphFrameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParagraphFrameController],
    }).compile();

    controller = module.get<ParagraphFrameController>(ParagraphFrameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
