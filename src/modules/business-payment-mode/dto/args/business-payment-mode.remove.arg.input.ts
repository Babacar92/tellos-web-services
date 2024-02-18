import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessPaymentModeEntity } from "src/entities/psql/BusinessPaymentModeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessPaymentModeExistConstraint } from "../../constraints/business-payment-mode.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessPaymentModeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessPaymentModeExistConstraint, {

    })
    @Transform(({ value }) => BusinessPaymentModeEntity.init(value))
    public id?: number | BusinessPaymentModeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}