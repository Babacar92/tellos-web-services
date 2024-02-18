import { Test, TestingModule } from '@nestjs/testing';
import { ArticleFamilyService } from './article-family.service';

describe('ArticleFamilyService', () => {
  let service: ArticleFamilyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleFamilyService],
    }).compile();

    service = module.get<ArticleFamilyService>(ArticleFamilyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
