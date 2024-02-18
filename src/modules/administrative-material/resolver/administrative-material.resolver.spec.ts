import { Test, TestingModule } from '@nestjs/testing';
import { AdministrativeMaterialResolver } from './administrative-material.resolver';

describe('AdministrativeMaterialResolver', () => {
  let resolver: AdministrativeMaterialResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdministrativeMaterialResolver],
    }).compile();

    resolver = module.get<AdministrativeMaterialResolver>(AdministrativeMaterialResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
