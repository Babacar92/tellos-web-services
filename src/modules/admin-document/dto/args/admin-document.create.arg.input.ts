import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { DocumentCategoryEntity } from "../../../../entities/psql/DocumentCategoryEntity";
import { Transform } from "class-transformer";
import { GraphqlFileUploadValidate } from "../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';

/**
 * Input for to create a new Quick Access
 */
export class AdminDocumentCreateArgInput {

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
    public active: boolean = true;

}