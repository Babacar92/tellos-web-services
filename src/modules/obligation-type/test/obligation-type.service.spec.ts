import { Test, TestingModule } from '@nestjs/testing';
import { ObligationTypeService } from '../obligation-type.service';

describe('ObligationTypeService', () => {
    let service: ObligationTypeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ObligationTypeService],
        }).compile();

        service = module.get<ObligationTypeService>(ObligationTypeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
