import { IsBoolean, IsOptional, Validate } from "class-validator";
import { LoginExistConstraint } from "../../../login/constraints/login.exist.constraint";
import { Transform } from "class-transformer";
import { LoginEntity } from "../../../../entities/psql/LoginEntity";
import { EntityExistConstraint } from "../../../entity/constraints/entity.exist.constraint";
import { EntityEntity } from "../../../../entities/psql/EntityEntity";
import { PermissionExistConstraint } from "../../../permission/constraints/permission.exist.constraint";
import { PermissionEntity } from "../../../../entities/psql/PermissionEntity";

/**
 * Input for to create a new Quick Access
 */
export class LoginPermissionCreateArgInput {

    /**
     * The login
     */
    @Validate(LoginExistConstraint, {

    })
    @Transform(({ value }) => LoginEntity.init(value))
    public login: LoginEntity;

    /**
     * The entity
     */
    @Validate(EntityExistConstraint, {

    })
    @Transform(({ value }) => EntityEntity.init(value))
    public entity: EntityEntity;

    /**
     * The permission
     */
    @Validate(PermissionExistConstraint, {

    })
    @Transform(({ value }) => PermissionEntity.init(value))
    public permission?: PermissionEntity;

    /**
     * The permission
     */
    @IsOptional()
    @Validate(PermissionExistConstraint, {

    })
    @Transform(({ value }) => value.map((p: number) => PermissionEntity.init(p)))
    public permissions?: PermissionEntity[];

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}