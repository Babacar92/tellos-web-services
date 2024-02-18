import { enumToArray } from "../../../utils/utils";

/**
 * User strategies Enum
 */
export enum LOGIN_USER_STRATEGIES {
    BEARER_HEADER = 'user_bearer_header_jwt',
    QUERY_PARAM = 'user_query_jwt',
}

/**
 * List of User Strategies
 */
export const LOGIN_USER_STRATEGIES_LIST: LOGIN_USER_STRATEGIES[] = enumToArray(LOGIN_USER_STRATEGIES);