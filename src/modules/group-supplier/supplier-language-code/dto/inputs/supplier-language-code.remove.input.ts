import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { RemoveTypeItemValidate } from '../../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../../libs/databases/dto/types/databases.type';
import { SupplierLanguageCodeEntity } from '@/entities/psql/SupplierLanguageCodeEntity';

/**
 * Input for to create a new supplier-category
 */
export class SupplierLanguageCodeRemoveInput {
    /**
     * Id of upload file
     */
    @Transform(({ value }) => SupplierLanguageCodeEntity.init(value))
    public id?: number | SupplierLanguageCodeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
