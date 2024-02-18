import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { BusinessDocumentTypeNotExistByColumnConstraint } from "../../constraints/business-document-type.not.exist.by.column.constraints";
import { BusinessDocumentTypeExistConstraint } from "../../constraints/business-document-type.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class BusinessDocumentTypeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessDocumentTypeExistConstraint, {

    })
    public id: number;

    /**
     * The title of Business document typetitle
     */
    @IsOptional()
    @IsString()
    @Validate(BusinessDocumentTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}