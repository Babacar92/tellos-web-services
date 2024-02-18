import { Test, TestingModule } from '@nestjs/testing';
import { SectionCodeResolver } from './section-code.resolver';

describe('SectionCodeResolver', () => {
  let resolver: SectionCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionCodeResolver],
    }).compile();

    resolver = module.get<SectionCodeResolver>(SectionCodeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
