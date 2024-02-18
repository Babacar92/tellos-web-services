import { Test, TestingModule } from '@nestjs/testing';
import { ObligationTypeResolver as ObligationTypeResolver } from '../obligation-type.resolver';

describe('ObligationTypeResolver', () => {
    let resolver: ObligationTypeResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ObligationTypeResolver],
        }).compile();

        resolver = module.get<ObligationTypeResolver>(ObligationTypeResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
