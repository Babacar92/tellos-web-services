import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { CustomerDocumentExistConstraint } from "../../constraints/customer-document.exist.constraint";
import { Transform } from "class-transformer";
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { CustomerExistConstraint } from "src/modules/customer/constraints/customer.exist.constraint";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { LoginEntity } from "src/entities/psql/LoginEntity";
import { GraphqlFileUploadValidate } from "../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate";

/**
 * Input for to update a new Quick Access
 */
export class CustomerDocumentUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(CustomerDocumentExistConstraint, {

    })
    public id: number;

    /**
     * Login of note
     */
    public login?: LoginEntity;

    /**
     * Customer of note
     */
    @IsOptional()
    @Transform(({ value }) => CustomerEntity.init(value))
    @Validate(CustomerExistConstraint, {

    })
    public customer?: CustomerEntity;

    /**
     * Uploaded Icon
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
    })
    public file?: GraphqlFileUpload;

    /**
     * Title
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * Title
     */
    @IsOptional()
    @IsString()
    public description?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}