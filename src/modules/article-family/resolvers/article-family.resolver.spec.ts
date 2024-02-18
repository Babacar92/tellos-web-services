import { Test, TestingModule } from '@nestjs/testing';
import { ArticleFamilyResolver } from './article-family.resolver';

describe('ArticleFamilyResolver', () => {
  let resolver: ArticleFamilyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleFamilyResolver],
    }).compile();

    resolver = module.get<ArticleFamilyResolver>(ArticleFamilyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
