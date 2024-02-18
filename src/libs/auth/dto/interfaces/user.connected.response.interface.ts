import { GROUPS_TYPES } from "../../../../types/groups.const";
import { PERMISSIONS_TYPES } from "../../../../types/permissions.const";
import { ROLES_TYPES } from "../../../../types/roles.const";

/**
 * Payload User Interface
 */
export interface UserConnectedResponseInterface {

    /**
     * The Access Token
     */
    accessToken?: string;

    /**
     * The User Roles
     */
    roles?: ROLES_TYPES[];

    /**
     * The User Groups
     */
    groups?: GROUPS_TYPES[];

    /**
     * The User Permissions
     */
    permissions?: PERMISSIONS_TYPES[];

}