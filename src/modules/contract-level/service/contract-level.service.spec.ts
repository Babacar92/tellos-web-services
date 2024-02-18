import { Test, TestingModule } from '@nestjs/testing';
import { ContractLevelService } from './contract-level.service';

describe('ContractTypeEntryService', () => {
  let service:  ContractLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractLevelService],
    }).compile();

    service = module.get<ContractLevelService>(ContractLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
