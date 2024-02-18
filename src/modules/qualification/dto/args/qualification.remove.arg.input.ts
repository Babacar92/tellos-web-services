import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { QualificationEntity } from "src/entities/psql/QualificationEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { QualificationExistConstraint } from "../../constraints/qualification.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class QualificationRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(QualificationExistConstraint, {

    })
    @Transform(({ value }) => QualificationEntity.init(value))
    public id?: number | QualificationEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}