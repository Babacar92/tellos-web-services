import { Test, TestingModule } from '@nestjs/testing';
import { SectionCodeService } from './section-code.service';

describe('SectionCodeService', () => {
  let service:SectionCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionCodeService],
    }).compile();

    service = module.get<SectionCodeService>(SectionCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
