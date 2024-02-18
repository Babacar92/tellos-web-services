import { Test, TestingModule } from '@nestjs/testing';
import { QuickAccessService } from './quick-access.service';

describe('QuickAccessService', () => {
  let service: QuickAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuickAccessService],
    }).compile();

    service = module.get<QuickAccessService>(QuickAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
