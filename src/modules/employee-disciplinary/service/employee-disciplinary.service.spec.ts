import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDisciplinaryService } from './employee-disciplinary.service';

describe('CareerPathService', () => {
  let service: EmployeeDisciplinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDisciplinaryService],
    }).compile();

    service = module.get<EmployeeDisciplinaryService>(EmployeeDisciplinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
