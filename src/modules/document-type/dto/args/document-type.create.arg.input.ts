import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { DocumentTypeNotExistByColumnConstraint } from "../../constraints/document-type.not.exist.by.column.constraints";
import { DocumentCategoryExistConstraint } from "src/modules/document-category/constraints/document-category.exist.constraint";
import { Transform } from "class-transformer";
import { DocumentCategoryEntity } from "src/entities/psql/DocumentCategoryEntity";

/**
 * Input for to create a new Quick Access
 */
export class DocumentTypeCreateArgInput {

    /**
     * The title of Quick Access
     */
    @IsString()
    @Validate(DocumentTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Category of document
     */
    @Validate(DocumentCategoryExistConstraint, {

    })
    @Transform(({ value }) => DocumentCategoryEntity.init(value))
    public category: DocumentCategoryEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}