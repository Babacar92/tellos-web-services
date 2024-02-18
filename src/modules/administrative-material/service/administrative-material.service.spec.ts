import { Test, TestingModule } from '@nestjs/testing';
import { AdministrativeMaterialService } from './administrative-material.service';

describe('AdministrativeMaterialService', () => {
  let service: AdministrativeMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdministrativeMaterialService],
    }).compile();

    service = module.get<AdministrativeMaterialService>(AdministrativeMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
