import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { BusinessDocumentClassificationNotExistByColumnConstraint } from "../../constraints/business-document-classification.not.exist.by.column.constraints";
import { BusinessDocumentClassificationExistConstraint } from "../../constraints/business-document-classification.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class BusinessDocumentClassificationUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessDocumentClassificationExistConstraint, {

    })
    public id: number;

    /**
     * The title of Business document classificationtitle
     */
    @IsOptional()
    @IsString()
    @Validate(BusinessDocumentClassificationNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}