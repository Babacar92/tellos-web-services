import { Test, TestingModule } from '@nestjs/testing';
import { TranslationResolver } from './translation.resolver';

describe('TranslationResolver', () => {
  let resolver: TranslationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslationResolver],
    }).compile();

    resolver = module.get<TranslationResolver>(TranslationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
