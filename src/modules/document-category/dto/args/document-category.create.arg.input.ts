import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { DocumentCategoryNotExistByColumnConstraint } from "../../constraints/document-category.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class DocumentCategoryCreateArgInput {

    /**
     * The title of Quick Access
     */
    @IsString()
    @Validate(DocumentCategoryNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Uploaded Icon
     */
    @IsString()
    public icon: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}