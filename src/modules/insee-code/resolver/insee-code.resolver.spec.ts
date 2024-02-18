import { Test, TestingModule } from '@nestjs/testing';
import { InseeCodeResolver } from './insee-code.resolver';

describe('InseeCodeResolver', () => {
  let resolver: InseeCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InseeCodeResolver],
    }).compile();

    resolver = module.get<InseeCodeResolver>(InseeCodeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
