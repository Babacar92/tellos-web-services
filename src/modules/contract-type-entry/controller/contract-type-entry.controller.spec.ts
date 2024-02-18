import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypeEntryController } from './contract-type-entry.controller';

describe('ContractTypeEntryController', () => {
  let controller: ContractTypeEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractTypeEntryController],
    }).compile();

    controller = module.get<ContractTypeEntryController>(ContractTypeEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
