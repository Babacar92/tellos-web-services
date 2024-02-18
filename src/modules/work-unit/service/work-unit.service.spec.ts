import { Test, TestingModule } from '@nestjs/testing';
import { WorkUnitService } from './work-unit.service';

describe('WorkUnitService', () => {
  let service: WorkUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkUnitService],
    }).compile();

    service = module.get<WorkUnitService>(WorkUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
