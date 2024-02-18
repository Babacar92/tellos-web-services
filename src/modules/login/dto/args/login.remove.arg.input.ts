import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { LoginEntity } from "src/entities/psql/LoginEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { LoginExistConstraint } from "../../constraints/login.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class LoginRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(LoginExistConstraint, {

    })
    @Transform(({ value }) => LoginEntity.init(value))
    public id?: number | LoginEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}