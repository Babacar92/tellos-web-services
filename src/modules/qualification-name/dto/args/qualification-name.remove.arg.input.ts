import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { QualificationNameEntity } from "src/entities/psql/QualificationNameEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { QualificationNameExistConstraint } from "../../constraints/qualification-name.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class QualificationNameRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(QualificationNameExistConstraint, {

    })
    @Transform(({ value }) => QualificationNameEntity.init(value))
    public id?: number | QualificationNameEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}