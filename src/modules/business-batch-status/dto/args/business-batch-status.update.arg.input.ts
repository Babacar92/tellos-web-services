import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { BusinessBatchStatusNotExistByColumnConstraint } from "../../constraints/business-batch-status.not.exist.by.column.constraints";
import { BusinessBatchStatusExistConstraint } from "../../constraints/business-batch-status.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class BusinessBatchStatusUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessBatchStatusExistConstraint, {

    })
    public id: number;

    /**
     * The title of Business batch statustitle
     */
    @IsOptional()
    @IsString()
    @Validate(BusinessBatchStatusNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}