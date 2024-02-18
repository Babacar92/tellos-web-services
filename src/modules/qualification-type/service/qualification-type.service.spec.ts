import { Test, TestingModule } from '@nestjs/testing';
import { QualificationTypeService } from './qualification-type.service';

describe('QualificationTypeService', () => {
  let service: QualificationTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualificationTypeService],
    }).compile();

    service = module.get<QualificationTypeService>(QualificationTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
