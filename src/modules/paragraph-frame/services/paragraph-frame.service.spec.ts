import { Test, TestingModule } from '@nestjs/testing';
import { ParagraphFrameService } from './paragraph-frame.service';

describe('ParagraphFrameService', () => {
  let service: ParagraphFrameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParagraphFrameService],
    }).compile();

    service = module.get<ParagraphFrameService>(ParagraphFrameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
