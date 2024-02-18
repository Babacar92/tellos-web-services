import { Test, TestingModule } from '@nestjs/testing';
import { QualificationNameResolver } from './qualification-name.resolver';

describe('QualificationNameResolver', () => {
  let resolver: QualificationNameResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualificationNameResolver],
    }).compile();

    resolver = module.get<QualificationNameResolver>(QualificationNameResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
