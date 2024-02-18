import { SetMetadata } from "@nestjs/common";
import { GROUPS_TYPES } from "../../../types/groups.const";
import { PERMISSIONS_TYPES } from "../../../types/permissions.const";
import { ROLES_TYPES } from "../../../types/roles.const";

/**
 * Has Role key
 */
export const HAS_ROLE_KEY = 'HAS_ROLE_KEY';

/**
 * Has Role Decorator
 */
export const HasRole = (...roles: ROLES_TYPES[]) => SetMetadata(HAS_ROLE_KEY, roles);

/**
 * Has Permission key
 */
export const HAS_PERMISSION_KEY = 'HAS_PERMISSION_KEY';

/**
 * Has Permission Decorator
 */
export const HasPerm = (...permissions: PERMISSIONS_TYPES[]) => SetMetadata(HAS_PERMISSION_KEY, permissions);

/**
 * Is in Group
 */
export const IN_GROUP_KEY = 'IN_GROUP_KEY';

/**
 * In Group Decorator
 */
export const InGroup = (...groups: GROUPS_TYPES[]) => SetMetadata(IN_GROUP_KEY, groups);
