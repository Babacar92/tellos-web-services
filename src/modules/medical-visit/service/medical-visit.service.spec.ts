import { Test, TestingModule } from '@nestjs/testing';
import { MedicalVisitService } from './medical-visit.service';

describe('CareerPathService', () => {
  let service: MedicalVisitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalVisitService],
    }).compile();

    service = module.get<MedicalVisitService>(MedicalVisitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
