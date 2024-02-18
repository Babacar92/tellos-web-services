import { Test, TestingModule } from '@nestjs/testing';
import { ContructionSiteResolver } from '../construction-site.resolver';

describe('ContructionSiteResolver', () => {
    let resolver: ContructionSiteResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ContructionSiteResolver],
        }).compile();

        resolver = module.get<ContructionSiteResolver>(ContructionSiteResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
