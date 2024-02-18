import { Test, TestingModule } from '@nestjs/testing';
import { CustomerTimelineService } from './customer-timeline.service';

describe('CustomerTimelineService', () => {
  let service: CustomerTimelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerTimelineService],
    }).compile();

    service = module.get<CustomerTimelineService>(CustomerTimelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
