import { Test, TestingModule } from '@nestjs/testing';
import { ContractSectionController } from './contract-section.controller';

describe('ContractSectionController', () => {
  let controller: ContractSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractSectionController],
    }).compile();

    controller = module.get<ContractSectionController>(ContractSectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
