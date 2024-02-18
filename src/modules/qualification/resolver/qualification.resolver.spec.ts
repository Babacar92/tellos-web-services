import { Test, TestingModule } from '@nestjs/testing';
import { QualificationResolver } from './qualification.resolver';

describe('QualificationResolver', () => {
  let resolver: QualificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualificationResolver],
    }).compile();

    resolver = module.get<QualificationResolver>(QualificationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
