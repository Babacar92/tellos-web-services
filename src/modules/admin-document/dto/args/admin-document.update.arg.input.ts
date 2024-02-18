import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { AdminDocumentExistConstraint } from "../../constraints/admin-document.exist.constraint";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { DocumentCategoryEntity } from "../../../../entities/psql/DocumentCategoryEntity";
import { Transform } from "class-transformer";
import { GraphqlFileUploadValidate } from "../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate";

/**
 * Input for to update a new Quick Access
 */
export class AdminDocumentUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(AdminDocumentExistConstraint, {

    })
    public id: number;

    /**
     * The name of Qualification Name
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The category
     */
    @IsOptional()
    @Validate(() => DocumentCategoryEntity, {

    })
    @Transform(({ value }) => DocumentCategoryEntity.init(value))
    public category?: DocumentCategoryEntity;

    /**
     * The file
     */
    @IsOptional()
    @GraphqlFileUploadValidate({

    })
    public file?: GraphqlFileUpload;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}