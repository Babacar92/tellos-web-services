import { Test, TestingModule } from '@nestjs/testing';
import { CustomerTimelineResolver } from './customer-timeline.resolver';

describe('CustomerTimelineResolver', () => {
  let resolver: CustomerTimelineResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerTimelineResolver],
    }).compile();

    resolver = module.get<CustomerTimelineResolver>(CustomerTimelineResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
