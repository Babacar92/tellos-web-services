import { Test, TestingModule } from '@nestjs/testing';
import { ImageResizeService } from './image.resize.service';

describe('ImageResizeService', () => {
  let service: ImageResizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageResizeService],
    }).compile();

    service = module.get<ImageResizeService>(ImageResizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
