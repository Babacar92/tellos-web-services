import { Test, TestingModule } from '@nestjs/testing';
import { WorkUnitResolver } from './work-unit.resolver';

describe('WorkUnitResolver', () => {
  let resolver: WorkUnitResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkUnitResolver],
    }).compile();

    resolver = module.get<WorkUnitResolver>(WorkUnitResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
