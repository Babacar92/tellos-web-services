import { Test, TestingModule } from '@nestjs/testing';
import { MediumSizedCentreController } from './medium-sized-centre.controller';

describe('MediumSizedCentreController', () => {
  let controller: MediumSizedCentreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediumSizedCentreController],
    }).compile();

    controller = module.get<MediumSizedCentreController>(MediumSizedCentreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
