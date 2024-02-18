import { Test, TestingModule } from '@nestjs/testing';
import { ContractSectionService } from './contract-section.service';

describe('ContractSectionService', () => {
  let service:  ContractSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractSectionService],
    }).compile();

    service = module.get<ContractSectionService>(ContractSectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
