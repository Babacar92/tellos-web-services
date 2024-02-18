import { Test, TestingModule } from '@nestjs/testing';
import { ContractInfoService } from './contract-info.service';

describe('ContractInfoService', () => {
  let service: ContractInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractInfoService],
    }).compile();

    service = module.get<ContractInfoService>(ContractInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
