import { Test, TestingModule } from '@nestjs/testing';
import { QuickAccessResolver } from './quick-access.resolver';

describe('QuickAccessResolver', () => {
  let resolver: QuickAccessResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuickAccessResolver],
    }).compile();

    resolver = module.get<QuickAccessResolver>(QuickAccessResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
