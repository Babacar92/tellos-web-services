import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { NotificationExistConstraint } from "../../constraints/notification.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class NotificationUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(NotificationExistConstraint, {

    })
    public id: number;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}