import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentDocumentService } from './equipment-document.service';

describe('Service', () => {
  let service: EquipmentDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentDocumentService],
    }).compile();

    service = module.get<EquipmentDocumentService>(EquipmentDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
