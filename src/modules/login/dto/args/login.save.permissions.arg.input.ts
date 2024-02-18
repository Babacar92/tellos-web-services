import { Validate } from "class-validator";
import { LoginExistConstraint } from "../../constraints/login.exist.constraint";
import { Transform } from "class-transformer";
import { LoginEntity } from "../../../../entities/psql/LoginEntity";
import { EntityExistConstraint } from "../../../entity/constraints/entity.exist.constraint";
import { EntityEntity } from "../../../../entities/psql/EntityEntity";
import { PermissionEntity } from "../../../../entities/psql/PermissionEntity";
import { PermissionExistConstraint } from "../../../permission/constraints/permission.exist.constraint";

export class LoginSavePermissionArgInput {

    /**
     * The login ID
     */
    @Validate(LoginExistConstraint, {

    })
    @Transform(({ value }) => LoginEntity.init(value))
    public loginId: LoginEntity;

    /**
     * The entity Id
     */
    @Validate(EntityExistConstraint, {

    })
    @Transform(({ value }) => EntityEntity.init(value))
    public entityId: EntityEntity;

    /**
     * The permissions IDS
     */
    @Validate(PermissionExistConstraint, {

    })
    @Transform(({ value }) => value.map((p: number) => PermissionEntity.init(p)))
    public permissionsIds: PermissionEntity[];

}