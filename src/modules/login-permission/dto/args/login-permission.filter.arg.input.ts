import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class LoginPermissionFilterArgInput extends DatabaseFilterArg {

    /**
     * The login Id
     */
    @IsOptional()
    @IsInt()
    public loginId?: number;

    /**
     * The entity Id
     */
    @IsOptional()
    @IsInt()
    public entityId?: number;

    /**
     * The permission Id
     */
    @IsOptional()
    @IsInt()
    public permissionId?: number;

    /**
     * The permission name
     */
    @IsOptional()
    @IsString()
    public permissionName?: string;

}