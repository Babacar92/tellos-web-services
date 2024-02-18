import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { GraphqlFileUploadValidate } from "src/libs/upload/decorators/validators/GraphqlFileUploadValidate";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { DocumentCategoryNotExistByColumnConstraint } from "../../constraints/document-category.not.exist.by.column.constraints";
import { DocumentCategoryExistConstraint } from "../../constraints/document-category.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class DocumentCategoryUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(DocumentCategoryExistConstraint, {

    })
    public id: number;

    /**
     * The title of Quick Access
     */
    @IsOptional()
    @IsString()
    @Validate(DocumentCategoryNotExistByColumnConstraint, {

    })
    public title?: string;

    /**
     * Uploaded Icon
     */
    @IsOptional()
    @IsString()
    public icon?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}