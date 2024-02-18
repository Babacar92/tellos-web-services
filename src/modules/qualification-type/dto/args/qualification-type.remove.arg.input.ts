import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { QualificationTypeEntity } from "src/entities/psql/QualificationTypeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { QualificationTypeExistConstraint } from "../../constraints/qualification-type.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class QualificationTypeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(QualificationTypeExistConstraint, {

    })
    @Transform(({ value }) => QualificationTypeEntity.init(value))
    public id?: number | QualificationTypeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}