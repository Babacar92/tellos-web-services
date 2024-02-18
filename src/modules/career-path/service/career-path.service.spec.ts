import { Test, TestingModule } from '@nestjs/testing';
import { CareerPathService } from './career-path.service';

describe('CareerPathService', () => {
  let service: CareerPathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CareerPathService],
    }).compile();

    service = module.get<CareerPathService>(CareerPathService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
