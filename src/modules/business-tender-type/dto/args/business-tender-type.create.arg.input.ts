import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { BusinessTenderTypeNotExistByColumnConstraint } from "../../constraints/business-tender-type.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class BusinessTenderTypeCreateArgInput {

    /**
     * The title of Business tender typetitle
     */
    @IsString()
    @Validate(BusinessTenderTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}