import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { ConstructionSite } from '@/entities/psql/construction-site.entity';
import { ConstructionSiteExistConstraint } from '../../constraints/construction-site.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class ConstructionSiteRemoveArgInput {
    /**
     * Id of upload file
     */
    @Validate(ConstructionSiteExistConstraint, {})
    @Transform(({ value }) => ConstructionSite.init(value))
    public id?: number | ConstructionSite;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
