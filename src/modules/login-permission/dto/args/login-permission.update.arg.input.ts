import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { LoginPermissionNotExistByColumnConstraint } from "../../constraints/login-permission.not.exist.by.column.constraints";
import { LoginPermissionExistConstraint } from "../../constraints/login-permission.exist.constraint";
import { LoginExistConstraint } from "../../../login/constraints/login.exist.constraint";
import { Transform } from "class-transformer";
import { LoginEntity } from "../../../../entities/psql/LoginEntity";
import { EntityExistConstraint } from "../../../entity/constraints/entity.exist.constraint";
import { EntityEntity } from "../../../../entities/psql/EntityEntity";
import { PermissionExistConstraint } from "../../../permission/constraints/permission.exist.constraint";
import { PermissionEntity } from "../../../../entities/psql/PermissionEntity";

/**
 * Input for to update a new Quick Access
 */
export class LoginPermissionUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(LoginPermissionExistConstraint, {

    })
    public id: number;

    /**
     * The login
     */
    @IsOptional()
    @Validate(LoginExistConstraint, {

    })
    @Transform(({ value }) => LoginEntity.init(value))
    public login?: LoginEntity;

    /**
     * The entity
     */
    @IsOptional()
    @Validate(EntityExistConstraint, {

    })
    @Transform(({ value }) => EntityEntity.init(value))
    public entity?: EntityEntity;

    /**
     * The permission
     */
    @IsOptional()
    @Validate(PermissionExistConstraint, {

    })
    @Transform(({ value }) => PermissionEntity.init(value))
    public permission?: PermissionEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}