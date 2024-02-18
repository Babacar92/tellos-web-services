import { GROUPS_TYPES } from '../../../../types/groups.const';
import { PERMISSIONS_TYPES } from '../../../../types/permissions.const';
import { ROLES_TYPES } from '../../../../types/roles.const';

/**
 * Payload User Interface
 */
export interface UserPayloadInterface {
    /**
     * Id of User
     */
    sub?: number;

    /**
     * Username of User
     */
    username?: string;

    /**
     * Email of User
     */
    email?: string;

    /**
     * Permissions of User
     */
    permissions?: PERMISSIONS_TYPES[];
}
