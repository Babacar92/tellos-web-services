import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDocumentTypeController } from './business-document-type.controller';

describe('BusinessDocumentTypeController', () => {
  let controller: BusinessDocumentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessDocumentTypeController],
    }).compile();

    controller = module.get<BusinessDocumentTypeController>(BusinessDocumentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
