import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { PurchaseAccountEntity } from "src/entities/psql/PurchaseAccountEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { PurchaseAccountExistConstraint } from "../../constraints/purchase-account.exist.constraint";

/**
 * Input for to remove a new Quick Access
 */
export class PurchaseAccountRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(PurchaseAccountExistConstraint, {

    })
    @Transform(({ value }) => PurchaseAccountEntity.init(value))
    public id?: number | PurchaseAccountEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}