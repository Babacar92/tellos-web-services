import { Test, TestingModule } from '@nestjs/testing';
import { EntityResolver } from './entity.resolver';

describe('EntityResolver', () => {
  let resolver: EntityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityResolver],
    }).compile();

    resolver = module.get<EntityResolver>(EntityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
