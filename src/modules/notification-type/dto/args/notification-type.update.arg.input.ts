import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { NotificationTypeNotExistByColumnConstraint } from "../../constraints/notification-type.not.exist.by.column.constraints";
import { NotificationTypeExistConstraint } from "../../constraints/notification-type.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class NotificationTypeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(NotificationTypeExistConstraint, {

    })
    public id: number;

    /**
     * The name of Notification type
     */
    @IsOptional()
    @IsString()
    @Validate(NotificationTypeNotExistByColumnConstraint, {

    })
    public title?: string;

    /**
     * The name of Notification type
     */
    @IsOptional()
    @IsString()
    public icon?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}