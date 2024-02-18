import { Test, TestingModule } from '@nestjs/testing';
import { ParagraphFrameResolver } from './paragraph-frame.resolver';

describe('ParagraphFrameResolver', () => {
  let resolver: ParagraphFrameResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParagraphFrameResolver],
    }).compile();

    resolver = module.get<ParagraphFrameResolver>(ParagraphFrameResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
