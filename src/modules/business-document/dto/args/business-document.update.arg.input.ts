import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { BusinessDocumentExistConstraint } from "../../constraints/business-document.exist.constraint";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { LoginEntity } from "../../../../entities/psql/LoginEntity";
import { BusinessDocumentTypeExistConstraint } from "../../../business-document-type/constraints/business-document-type.exist.constraint";
import { BusinessDocumentTypeEntity } from "../../../../entities/psql/BusinessDocumentTypeEntity";
import { Transform } from "class-transformer";
import { BusinessDocumentClassificationExistConstraint } from "../../../business-document-classification/constraints/business-document-classification.exist.constraint";
import { BusinessDocumentClassificationEntity } from "../../../../entities/psql/BusinessDocumentClassificationEntity";
import { GraphqlFileUploadValidate } from "../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate";

/**
 * Input for to update a new Quick Access
 */
export class BusinessDocumentUpdateArgInput {

    /**
     * Current login
     */
    public login?: LoginEntity;

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessDocumentExistConstraint, {

    })
    public id: number;

    /**
     * Label
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * Type
     */
    @IsOptional()
    @Validate(BusinessDocumentTypeExistConstraint, {

    })
    @Transform(({ value }) => BusinessDocumentTypeEntity.init(value))
    public type?: BusinessDocumentTypeEntity;

    /**
     * Classification
     */
    @IsOptional()
    @Validate(BusinessDocumentClassificationExistConstraint, {

    })
    @Transform(({ value }) => BusinessDocumentClassificationEntity.init(value))
    public classification?: BusinessDocumentClassificationEntity;

    /**
     * The picture of Employee
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