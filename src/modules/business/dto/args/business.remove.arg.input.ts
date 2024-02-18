import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessEntity } from "src/entities/psql/BusinessEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessExistConstraint } from "../../constraints/business.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessExistConstraint, {

    })
    @Transform(({ value }) => BusinessEntity.init(value))
    public id?: number | BusinessEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}