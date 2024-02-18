import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { EmployeeDocumentEntity } from "src/entities/psql/EmployeeDocumentEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { EmployeeDocumentExistConstraint } from "../../constraints/employee-document.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class EmployeeDocumentRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(EmployeeDocumentExistConstraint, {

    })
    @Transform(({ value }) => EmployeeDocumentEntity.init(value))
    public id?: number | EmployeeDocumentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}