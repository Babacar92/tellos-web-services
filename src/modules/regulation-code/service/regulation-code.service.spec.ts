import { Test, TestingModule } from '@nestjs/testing';
import { RegulationCodeService } from './regulation-code.service';

describe('RegulationCodeService', () => {
  let service: RegulationCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegulationCodeService],
    }).compile();

    service = module.get<RegulationCodeService>(RegulationCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
