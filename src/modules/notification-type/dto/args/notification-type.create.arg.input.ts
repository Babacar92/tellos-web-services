import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { NotificationTypeNotExistByColumnConstraint } from "../../constraints/notification-type.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class NotificationTypeCreateArgInput {


    /**
     * The title of Notification type
     */
    @IsString()
    @Validate(NotificationTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * The icon of Notification type
     */
    @IsString()
    public icon: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}