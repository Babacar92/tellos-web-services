import { Test, TestingModule } from '@nestjs/testing';
import { MediumSizedCentreResolver } from './medium-sized-centre.resolver';

describe('MediumSizedCentreResolver', () => {
  let resolver: MediumSizedCentreResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediumSizedCentreResolver],
    }).compile();

    resolver = module.get<MediumSizedCentreResolver>(MediumSizedCentreResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
