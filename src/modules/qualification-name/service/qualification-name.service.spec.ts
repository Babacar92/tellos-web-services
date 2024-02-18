import { Test, TestingModule } from '@nestjs/testing';
import { QualificationNameService } from './qualification-name.service';

describe('QualificationNameService', () => {
  let service: QualificationNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualificationNameService],
    }).compile();

    service = module.get<QualificationNameService>(QualificationNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
