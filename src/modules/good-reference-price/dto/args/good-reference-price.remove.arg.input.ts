import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { GoodReferencePriceEntity } from 'src/entities/psql/GoodReferencePriceEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { GoodReferencePriceExistConstraint } from '../../constraints/good-reference-price.exist.constraint';

/**
 * Input for to create a new goodReferencePrice
 */
export class GoodReferencePriceRemoveArgInput {
    /**
     * Id of upload file
     */
    @Validate(GoodReferencePriceExistConstraint, {})
    @Transform(({ value }) => GoodReferencePriceEntity.init(value))
    public id?: number | GoodReferencePriceEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
