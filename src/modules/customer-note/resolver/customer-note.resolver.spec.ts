import { Test, TestingModule } from '@nestjs/testing';
import { CustomerNoteResolver } from './customer-note.resolver';

describe('CustomerNoteResolver', () => {
  let resolver: CustomerNoteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerNoteResolver],
    }).compile();

    resolver = module.get<CustomerNoteResolver>(CustomerNoteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
