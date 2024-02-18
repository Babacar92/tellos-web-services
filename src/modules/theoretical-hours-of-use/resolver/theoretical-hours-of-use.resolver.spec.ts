import { Test, TestingModule } from '@nestjs/testing';
import { TheoreticalHoursOfUseResolver } from './theoretical-hours-of-use.resolver';

describe('TheoreticalHoursOfUseResolver', () => {
  let resolver: TheoreticalHoursOfUseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TheoreticalHoursOfUseResolver],
    }).compile();

    resolver = module.get<TheoreticalHoursOfUseResolver>(TheoreticalHoursOfUseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
