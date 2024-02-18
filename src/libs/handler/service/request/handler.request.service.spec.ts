import { Test, TestingModule } from '@nestjs/testing';
import { HandlerRequestService } from './handler.request.service';

describe('HandlerRequestService', () => {
  let service: HandlerRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandlerRequestService],
    }).compile();

    service = module.get<HandlerRequestService>(HandlerRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
