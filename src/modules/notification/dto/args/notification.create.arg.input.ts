import { IsBoolean, IsOptional } from "class-validator";

/**
 * Input for to create a new Quick Access
 */
export class NotificationCreateArgInput {

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}