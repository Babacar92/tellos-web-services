import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessMarketTypeEntity } from "src/entities/psql/BusinessMarketTypeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessMarketTypeExistConstraint } from "../../constraints/business-market-type.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessMarketTypeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessMarketTypeExistConstraint, {

    })
    @Transform(({ value }) => BusinessMarketTypeEntity.init(value))
    public id?: number | BusinessMarketTypeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}