import { Test, TestingModule } from '@nestjs/testing';
import { OwnerEntityResolver } from '../owner-entity.resolver';

describe('OwnerEntityResolver', () => {
  let resolver: OwnerEntityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnerEntityResolver],
    }).compile();

    resolver = module.get<OwnerEntityResolver>(OwnerEntityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
