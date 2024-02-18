import { Test, TestingModule } from '@nestjs/testing';
import { BusinessTenderTypeController } from './business-tender-type.controller';

describe('BusinessTenderTypeController', () => {
  let controller: BusinessTenderTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessTenderTypeController],
    }).compile();

    controller = module.get<BusinessTenderTypeController>(BusinessTenderTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
