import { Test, TestingModule } from '@nestjs/testing';
import { BusinessTenderTypeService } from './business-tender-type.service';

describe('BusinessTenderTypeService', () => {
  let service: BusinessTenderTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessTenderTypeService],
    }).compile();

    service = module.get<BusinessTenderTypeService>(BusinessTenderTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
