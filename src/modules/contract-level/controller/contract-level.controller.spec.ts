import { Test, TestingModule } from '@nestjs/testing';
import { ContractLevelController } from './contract-level.controller';

describe('ContractLevelController', () => {
  let controller: ContractLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractLevelController],
    }).compile();

    controller = module.get<ContractLevelController>(ContractLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
