import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { CustomerContactEntity } from "src/entities/psql/CustomerContactEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { CustomerContactExistConstraint } from "../../constraints/customer-contact.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class CustomerContactRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(CustomerContactExistConstraint, {

    })
    @Transform(({ value }) => CustomerContactEntity.init(value))
    public id?: number | CustomerContactEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}