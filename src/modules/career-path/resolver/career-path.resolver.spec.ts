import { Test, TestingModule } from '@nestjs/testing';
import { CareerPathResolver } from './career-path.resolver';

describe('CareerPathResolver', () => {
  let resolver: CareerPathResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CareerPathResolver],
    }).compile();

    resolver = module.get<CareerPathResolver>(CareerPathResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
