import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString, Validate } from "class-validator";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { GraphqlFileUploadValidate } from "src/libs/upload/decorators/validators/GraphqlFileUploadValidate";
import { CustomerExistConstraint } from "src/modules/customer/constraints/customer.exist.constraint";
import { CustomerContactNotExistByColumnConstraint } from "../../constraints/customer-contact.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class CustomerContactCreateArgInput {

    /**
     * Customer of contact
     */
    @Transform(({ value }) => CustomerEntity.init(value))
    @Validate(CustomerExistConstraint, {

    })
    public customer: CustomerEntity;

    /**
     * Lastname of contact
     */
    @IsString()
    @Validate(CustomerContactNotExistByColumnConstraint, {

    })
    public lastname: string;

    /**
     * Firstname of contact
     */
    @IsString()
    @Validate(CustomerContactNotExistByColumnConstraint, {

    })
    public firstname: string;

    /**
     * Email of contact
     */
    @IsEmail()
    @Validate(CustomerContactNotExistByColumnConstraint, {

    })
    public email: string;

    /**
     * Uploaded Icon
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: [
            'jpg', 'png', 'jpeg', 'jfif'
        ],
    })
    public picture?: GraphqlFileUpload;

    /**
     * Company of contact
     */
    @IsOptional()
    @IsString()
    public company?: string;

    /**
     * Department of contact
     */
    @IsOptional()
    @IsString()
    public department?: string;

    /**
     * Position of contact
     */
    @IsOptional()
    @IsString()
    public position?: string;

    /**
     * Phone of contact
     */
    @IsOptional()
    @IsString()
    public phone?: string;

    /**
     * Phone fix of contact
     */
    @IsOptional()
    @IsString()
    public phoneFix?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}