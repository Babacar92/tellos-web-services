import { ValueOf } from "src/types/default.types";
import { enumToArray } from "../utils/utils";

/**
 * Tokens
 */
export const TOKENS_NAMES = {
    RESET_PASSWORD: 'TOKEN_RESET_PASSWORD',
} as const;

/**
 * Type of TOKENS
 */
export type TOKENS_TYPES = ValueOf<typeof TOKENS_NAMES>;

/**
 * All Tokens Names
 */
export const TOKENS_LIST: TOKENS_TYPES[] = enumToArray(TOKENS_NAMES);