import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypeEntryService } from './contract-type-entry.service';

describe('ContractTypeEntryService', () => {
  let service: ContractTypeEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractTypeEntryService],
    }).compile();

    service = module.get<ContractTypeEntryService>(ContractTypeEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
