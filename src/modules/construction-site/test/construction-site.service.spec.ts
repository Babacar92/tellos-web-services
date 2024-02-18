import { Test, TestingModule } from '@nestjs/testing';
import { ConstructionSiteService } from '../construction-site.service';

describe('ConstructionSiteService', () => {
    let service: ConstructionSiteService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConstructionSiteService],
        }).compile();

        service = module.get<ConstructionSiteService>(ConstructionSiteService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
