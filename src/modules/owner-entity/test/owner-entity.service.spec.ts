import { Test, TestingModule } from '@nestjs/testing';
import { OwnerEntityService } from '../owner-entity.service';

describe('OwnerEntityService', () => {
  let service: OwnerEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnerEntityService],
    }).compile();

    service = module.get<OwnerEntityService>(OwnerEntityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
