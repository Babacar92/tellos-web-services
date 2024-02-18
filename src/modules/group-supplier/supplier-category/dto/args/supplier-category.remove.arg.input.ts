import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { SupplierCategoryEntity } from 'src/entities/psql/SupplierCategoryEntity';
import { RemoveTypeItemValidate } from '../../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../../libs/databases/dto/types/databases.type';
import { SupplierCategoryExistConstraint } from '../../constraints/supplier-category.exist.constraint';

/**
 * Input for to create a new supplier-category
 */
export class SupplierCategoryRemoveArgInput {
    /**
     * Id of upload file
     */
    @Validate(SupplierCategoryExistConstraint, {})
    @Transform(({ value }) => SupplierCategoryEntity.init(value))
    public id?: number | SupplierCategoryEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
