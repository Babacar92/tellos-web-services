import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessBatchEntity } from "src/entities/psql/BusinessBatchEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessBatchExistConstraint } from "../../constraints/business-batch.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessBatchRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessBatchExistConstraint, {

    })
    @Transform(({ value }) => BusinessBatchEntity.init(value))
    public id?: number | BusinessBatchEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}