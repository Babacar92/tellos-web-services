import { Test, TestingModule } from '@nestjs/testing';
import { ContractApprenticeController } from './contract-apprentice.controller';

describe('ContractApprenticeController', () => {
  let controller: ContractApprenticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractApprenticeController],
    }).compile();

    controller = module.get<ContractApprenticeController>(ContractApprenticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
