import { Test, TestingModule } from '@nestjs/testing';
import { QualificationTypeResolver } from './leave-distribution.resolver';

describe('QualificationTypeResolver', () => {
  let resolver: QualificationTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualificationTypeResolver],
    }).compile();

    resolver = module.get<QualificationTypeResolver>(QualificationTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
