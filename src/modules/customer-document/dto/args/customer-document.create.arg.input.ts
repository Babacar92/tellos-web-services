import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString, Validate } from "class-validator";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { CustomerExistConstraint } from "src/modules/customer/constraints/customer.exist.constraint";
import { LoginEntity } from "src/entities/psql/LoginEntity";
import { GraphqlFileUploadValidate } from "../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate";

/**
 * Input for to create a new Quick Access
 */
export class CustomerDocumentCreateArgInput {

    /**
     * Login of note
     */
    public login?: LoginEntity;

    /**
     * Customer of note
     */
    @Transform(({ value }) => CustomerEntity.init(value))
    @Validate(CustomerExistConstraint, {

    })
    public customer: CustomerEntity;

    /**
     * Uploaded Icon
     */
    @GraphqlFileUploadValidate({
    })
    public file: GraphqlFileUpload;

    /**
     * Title
     */
    @IsString()
    public title: string;

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
    public active: boolean = true;

}