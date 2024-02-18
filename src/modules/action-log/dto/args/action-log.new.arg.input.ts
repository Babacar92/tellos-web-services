import { ACTION_LOG_TYPES } from "../types/actions.types.enum";

export class ActionLogArgInput {

    /**
     * Message of Action Log
     */
    public type: ACTION_LOG_TYPES;

    /**
     * User id of Action Log
     */
    public user: {
        id: number,
        entity: string,
    };

    /**
     * Item id of Action Log
     */
    public data: any;

}