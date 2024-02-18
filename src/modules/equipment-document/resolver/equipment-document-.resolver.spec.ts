import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentDocumentResolver } from './equipment-document.resolver';

describe('EquipmentDocumentResolver', () => {
  let resolver: EquipmentDocumentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentDocumentResolver],
    }).compile();

    resolver = module.get<EquipmentDocumentResolver>(EquipmentDocumentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
