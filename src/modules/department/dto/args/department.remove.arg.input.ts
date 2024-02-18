import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { DepartmentEntity } from "../../../../entities/psql/DepartmentEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { DepartmentExistConstraint } from "../../constraints/department.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class DepartmentRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(DepartmentExistConstraint, {

    })
    @Transform(({ value }) => DepartmentEntity.init(value))
    public id?: number | DepartmentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}