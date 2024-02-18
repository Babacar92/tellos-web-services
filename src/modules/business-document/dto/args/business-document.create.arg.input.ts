import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { BusinessDocumentTypeExistConstraint } from "../../../business-document-type/constraints/business-document-type.exist.constraint";
import { Transform } from "class-transformer";
import { BusinessDocumentTypeEntity } from "../../../../entities/psql/BusinessDocumentTypeEntity";
import { BusinessDocumentClassificationExistConstraint } from "../../../business-document-classification/constraints/business-document-classification.exist.constraint";
import { BusinessDocumentClassificationEntity } from "../../../../entities/psql/BusinessDocumentClassificationEntity";
import { LoginEntity } from "../../../../entities/psql/LoginEntity";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { GraphqlFileUploadValidate } from "../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate";
import { BusinessEntity } from "../../../../entities/psql/BusinessEntity";
import { BusinessExistConstraint } from "../../../business/constraints/business.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessDocumentCreateArgInput {

    /**
     * Current login
     */
    public login?: LoginEntity;

    /**
     * Label
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * Business
     */
    @IsOptional()
    @Validate(BusinessExistConstraint, {

    })
    @Transform(({ value }) => BusinessEntity.init(value))
    public business?: BusinessEntity;

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
    public active: boolean = true;

}