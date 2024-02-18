import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { CareerPathEntity } from "src/entities/psql/CareerPathEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { CareerPathExistConstraint } from "../../constraints/career-path.exist.constraint";

/**
 * Input for to remove a Career Path
 */
export class CareerPathRemoveArgInput {

    /**
     * Id of Career Path
     */
    @Validate(CareerPathExistConstraint, {

    })
    @Transform(({ value }) => CareerPathEntity.init(value))
    public id?: number | CareerPathEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}