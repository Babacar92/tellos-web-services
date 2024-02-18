import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { BusinessBatchStatusNotExistByColumnConstraint } from "../../constraints/business-batch-status.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class BusinessBatchStatusCreateArgInput {

    /**
     * The title of Business batch statustitle
     */
    @IsString()
    @Validate(BusinessBatchStatusNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}