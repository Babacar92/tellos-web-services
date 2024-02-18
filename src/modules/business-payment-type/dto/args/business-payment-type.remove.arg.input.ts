import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessPaymentTypeEntity } from "src/entities/psql/BusinessPaymentTypeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessPaymentTypeExistConstraint } from "../../constraints/business-payment-type.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessPaymentTypeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessPaymentTypeExistConstraint, {

    })
    @Transform(({ value }) => BusinessPaymentTypeEntity.init(value))
    public id?: number | BusinessPaymentTypeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}