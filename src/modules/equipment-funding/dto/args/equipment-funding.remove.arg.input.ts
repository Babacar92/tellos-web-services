import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { EquipmentFunding } from '@/entities/psql/equipment-funding.entity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { EquipmentFundingExistConstraint } from '../../constraints/equipment-funding.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class EquipmentFundingRemoveArgInput {
    /**
     * Id of upload file
     */
    @Validate(EquipmentFundingExistConstraint, {})
    @Transform(({ value }) => EquipmentFunding.init(value))
    public id?: number | EquipmentFunding;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
