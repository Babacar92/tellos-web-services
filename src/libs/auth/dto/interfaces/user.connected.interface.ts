import { PERMISSIONS_TYPES } from "../../../../types/permissions.const";
import { ROLES_TYPES } from "../../../../types/roles.const";

/**
 * Payload User Interface
 */
export interface UserConnectedInterface {

    /**
     * Getter for User Sub
     */
    getSub?(): number;

    /**
     * Getter for User username
     */
    getUsername?(): string;

    /**
     * Getter for User email
     */
    getEmail?(): string;

    /**
     * Getter for User password
     */
    getPassword?(): string;

}