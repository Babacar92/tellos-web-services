import { IsEnum, IsInt, IsObject, IsOptional, IsString, } from "class-validator";
import { ScheduleValidate } from "../../decorators/validator/ScheduleValidate";
import { ACTION_LOG_TYPES } from "../types/actions.types.enum";

export class ActionLogFilterArg {

    /**
     * The user entity
     * Not set by user request
     */
    public LoginEntity: string;


    /**
     * The id of log
     */
    @IsOptional()
    @IsString()
    public id?: string;

    /**
     * The id of log
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public ids?: string[];

    /**
     * Search of column
     */
    @IsOptional()
    @IsString()
    public search?: string;

    /**
     * Filter by type
     */
    @IsOptional()
    @IsEnum(ACTION_LOG_TYPES)
    public type?: ACTION_LOG_TYPES;

    /**
     * Filter by types
    */
    @IsOptional()
    @IsEnum(ACTION_LOG_TYPES, {
        each: true,
    })
    public types?: ACTION_LOG_TYPES[];

    /**
     * Filter by root
     */
    @IsOptional()
    @IsString()
    public root?: string;

    /**
     * Filter by roots
    */
    @IsOptional()
    @IsString({
        each: true,
    })
    public roots?: string[];

    /**
     * User ID
    */
    @IsOptional()
    @IsInt()
    public userId?: number;

    /**
     * User ID
    */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public userIds?: number[];

    /**
     * The created date schedule
     */
    @IsOptional()
    @ScheduleValidate()
    public dateSchedule?: { from: Date, to?: Date };

    /**
     * Search Actions
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public searchActions?: string[];

    /**
     * Search roots
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public searchRoots?: string[];

    /**
     * Search Users id
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public searchUserIds?: number[];

    /**
     * The data of action log
     */
    @IsOptional()
    @IsObject()
    public data?: Object;

}