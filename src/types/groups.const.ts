import { enumToArray } from "../utils/utils";
import { ValueOf } from "./default.types";

/**
 * Groups Users
 */
export const GROUPS_NAMES = {
    GUEST: "GROUP_GUEST",
} as const;

/**
 * Type of GROUPS
 */
export type GROUPS_TYPES = ValueOf<typeof GROUPS_NAMES>;

/**
 * List of group name
 */
export const GROUPS_LIST: GROUPS_TYPES[] = enumToArray(GROUPS_NAMES);