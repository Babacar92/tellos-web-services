import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { BusinessDocumentTypeNotExistByColumnConstraint } from "../../constraints/business-document-type.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class BusinessDocumentTypeCreateArgInput {

    /**
     * The title of Business document typetitle
     */
    @IsString()
    @Validate(BusinessDocumentTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}