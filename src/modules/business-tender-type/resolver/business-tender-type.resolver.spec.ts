import { Test, TestingModule } from '@nestjs/testing';
import { BusinessTenderTypeResolver } from './business-tender-type.resolver';

describe('BusinessTenderTypeResolver', () => {
  let resolver: BusinessTenderTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessTenderTypeResolver],
    }).compile();

    resolver = module.get<BusinessTenderTypeResolver>(BusinessTenderTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
