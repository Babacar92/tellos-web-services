import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { LoginPermissionEntity } from "src/entities/psql/LoginPermissionEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { LoginPermissionExistConstraint } from "../../constraints/login-permission.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class LoginPermissionRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(LoginPermissionExistConstraint, {

    })
    @Transform(({ value }) => LoginPermissionEntity.init(value))
    public id?: number | LoginPermissionEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}