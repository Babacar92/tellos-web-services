import { Test, TestingModule } from '@nestjs/testing';
import { ContractApprenticeService } from './contract-apprentice.service';

describe('ContractApprenticeService', () => {
  let service: ContractApprenticeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractApprenticeService],
    }).compile();

    service = module.get<ContractApprenticeService>(ContractApprenticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
