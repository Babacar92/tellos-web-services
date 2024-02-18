import { Test, TestingModule } from '@nestjs/testing';
import { RegulationCodeResolver } from './regulation-code.resolver';

describe('RegulationCodeResolver', () => {
  let resolver: RegulationCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegulationCodeResolver],
    }).compile();

    resolver = module.get<RegulationCodeResolver>(RegulationCodeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
