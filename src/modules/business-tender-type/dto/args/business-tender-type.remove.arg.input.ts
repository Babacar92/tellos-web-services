import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessTenderTypeEntity } from "src/entities/psql/BusinessTenderTypeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessTenderTypeExistConstraint } from "../../constraints/business-tender-type.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessTenderTypeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessTenderTypeExistConstraint, {

    })
    @Transform(({ value }) => BusinessTenderTypeEntity.init(value))
    public id?: number | BusinessTenderTypeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}