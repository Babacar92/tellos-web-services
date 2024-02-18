import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessBatchStatusEntity } from "src/entities/psql/BusinessBatchStatusEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessBatchStatusExistConstraint } from "../../constraints/business-batch-status.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessBatchStatusRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessBatchStatusExistConstraint, {

    })
    @Transform(({ value }) => BusinessBatchStatusEntity.init(value))
    public id?: number | BusinessBatchStatusEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}