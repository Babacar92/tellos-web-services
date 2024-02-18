import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { CustomerExistConstraint } from "../../constraints/customer.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class CustomerRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(CustomerExistConstraint, {

    })
    @Transform(({ value }) => CustomerEntity.init(value))
    public id?: number | CustomerEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}