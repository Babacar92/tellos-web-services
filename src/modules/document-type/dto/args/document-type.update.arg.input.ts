import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { DocumentTypeNotExistByColumnConstraint } from "../../constraints/document-type.not.exist.by.column.constraints";
import { DocumentTypeExistConstraint } from "../../constraints/document-type.exist.constraint";
import { DocumentCategoryExistConstraint } from "src/modules/document-category/constraints/document-category.exist.constraint";
import { DocumentCategoryEntity } from "src/entities/psql/DocumentCategoryEntity";
import { Transform } from "class-transformer";

/**
 * Input for to update a new Quick Access
 */
export class DocumentTypeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(DocumentTypeExistConstraint, {

    })
    public id: number;

    /**
     * The title of Quick Access
     */
    @IsOptional()
    @IsString()
    @Validate(DocumentTypeNotExistByColumnConstraint, {

    })
    public title?: string;

    /**
     * Category of document
     */
    @IsOptional()
    @Validate(DocumentCategoryExistConstraint, {

    })
    @Transform(({ value }) => DocumentCategoryEntity.init(value))
    public category?: DocumentCategoryEntity;

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