import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { ObligationTypeExistConstraint } from '../../constraints/obligation-type.exist.constraint';
import { ObligationType } from '@/entities/psql/obligation-type.entity';

/**
 * Input for to create a new Quick Access
 */
export class ObligationTypeRemoveArgInput {
    /**
     * Id of upload file
     */
    @Validate(ObligationTypeExistConstraint, {})
    @Transform(({ value }) => ObligationType.init(value))
    public id?: number | ObligationType;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
