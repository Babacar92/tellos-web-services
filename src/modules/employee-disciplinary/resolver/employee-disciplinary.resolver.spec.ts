import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDisciplinaryResolver } from './employee-disciplinary.resolver';

describe('EmployeeDisciplinaryResolver', () => {
  let resolver: EmployeeDisciplinaryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDisciplinaryResolver],
    }).compile();

    resolver = module.get<EmployeeDisciplinaryResolver>(EmployeeDisciplinaryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
