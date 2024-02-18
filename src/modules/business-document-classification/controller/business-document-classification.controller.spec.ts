import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDocumentClassificationController } from './business-document-classification.controller';

describe('BusinessDocumentClassificationController', () => {
  let controller: BusinessDocumentClassificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessDocumentClassificationController],
    }).compile();

    controller = module.get<BusinessDocumentClassificationController>(BusinessDocumentClassificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
