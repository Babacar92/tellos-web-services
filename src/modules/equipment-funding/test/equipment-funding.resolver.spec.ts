import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentFundingResolver } from '../equipment-funding.resolver';

describe('EquipmentFundingResolver', () => {
  let resolver: EquipmentFundingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentFundingResolver],
    }).compile();

    resolver = module.get<EquipmentFundingResolver>(EquipmentFundingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
