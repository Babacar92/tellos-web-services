import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaMongoose } from "mongoose";
import { ACTION_LOG_TYPES } from "../../modules/action-log/dto/types/actions.types.enum";

/**
 * The Document type
 */
export type ActionLogDocument = HydratedDocument<ActionLog>;

/**
 * The action log class
 */
@Schema()
export class ActionLog {

    /**
     * The constructor
     * @param data 
     */
    public constructor() { }

    /**
     * Id of Action Log
     */
    @Prop({
        type: SchemaMongoose.Types.ObjectId,
    })
    public id?: any;

    /**
     * Message of Action Log
     */
    @Prop({
        type: SchemaMongoose.Types.String,
        enum: ACTION_LOG_TYPES,
    })
    public type?: ACTION_LOG_TYPES;

    /**
     * Message of Action Log
     */
    @Prop({
        type: SchemaMongoose.Types.String,
    })
    public root?: string;

    /**
     * User id of Action Log
     */
    @Prop({
        type: SchemaMongoose.Types.Mixed,
    })
    public user?: any;

    /**
     * Data of action
     */
    @Prop({
        type: SchemaMongoose.Types.Mixed,
    })
    public data?: any;

    /**
     * Created At of Action Log
     */
    @Prop({
        type: SchemaMongoose.Types.Date,
    })
    public createdAt?: Date = new Date();

}

/**
 * The Action log schema factory
 */
export const ActionLogSchema = SchemaFactory.createForClass(ActionLog);