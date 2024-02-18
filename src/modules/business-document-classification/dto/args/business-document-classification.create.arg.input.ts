import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { BusinessDocumentClassificationNotExistByColumnConstraint } from "../../constraints/business-document-classification.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class BusinessDocumentClassificationCreateArgInput {

    /**
     * The title of Business document classificationtitle
     */
    @IsString()
    @Validate(BusinessDocumentClassificationNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}