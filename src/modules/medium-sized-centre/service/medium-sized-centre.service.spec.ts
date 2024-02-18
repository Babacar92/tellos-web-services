import { Test, TestingModule } from '@nestjs/testing';
import { MediumSizedCentreService } from './medium-sized-centre.service';

describe('MediumSizedCentreService', () => {
    let service: MediumSizedCentreService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MediumSizedCentreService],
        }).compile();

        service = module.get<MediumSizedCentreService>(
            MediumSizedCentreService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
