import { Test, TestingModule } from '@nestjs/testing';
import { InseeCodeService } from './insee-code.service';

describe('InseeCodeService', () => {
  let service:InseeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InseeCodeService],
    }).compile();

    service = module.get<InseeCodeService>(InseeCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
