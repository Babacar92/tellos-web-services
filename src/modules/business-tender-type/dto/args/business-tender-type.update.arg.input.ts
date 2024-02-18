import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { BusinessTenderTypeNotExistByColumnConstraint } from "../../constraints/business-tender-type.not.exist.by.column.constraints";
import { BusinessTenderTypeExistConstraint } from "../../constraints/business-tender-type.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class BusinessTenderTypeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessTenderTypeExistConstraint, {

    })
    public id: number;

    /**
     * The title of Business tender typetitle
     */
    @IsOptional()
    @IsString()
    @Validate(BusinessTenderTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}