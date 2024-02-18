import { Test, TestingModule } from '@nestjs/testing';
import { AdminDocumentService } from './admin-document.service';

describe('AdminDocumentService', () => {
  let service: AdminDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminDocumentService],
    }).compile();

    service = module.get<AdminDocumentService>(AdminDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
