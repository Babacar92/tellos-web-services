import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { Good } from 'src/entities/psql/good.entity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { GoodExistConstraint } from '../../constraints/good.exist.constraint';

/**
 * Input for to create a new Good
 */
export class GoodRemoveArgInput {
    /**
     * Id of upload file
     */
    @Validate(GoodExistConstraint, {})
    @Transform(({ value }) => Good.init(value))
    public id?: number | Good;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
