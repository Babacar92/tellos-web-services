import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { CustomerContactNotExistByColumnConstraint } from "../../constraints/customer-contact.not.exist.by.column.constraints";
import { CustomerContactExistConstraint } from "../../constraints/customer-contact.exist.constraint";
import { Transform } from "class-transformer";
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { CustomerExistConstraint } from "src/modules/customer/constraints/customer.exist.constraint";
import { GraphqlFileUploadValidate } from "src/libs/upload/decorators/validators/GraphqlFileUploadValidate";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';

/**
 * Input for to update a new Quick Access
 */
export class CustomerContactUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(CustomerContactExistConstraint, {

    })
    public id: number;

    /**
     * Customer of contact
     */
    @IsOptional()
    @Transform(({ value }) => CustomerEntity.init(value))
    @Validate(CustomerExistConstraint, {

    })
    public customer?: CustomerEntity;

    /**
     * Lastname of contact
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerContactNotExistByColumnConstraint, {

    })
    public lastname?: string;

    /**
     * Firstname of contact
     */
    @IsOptional()
    @IsString()
    @Validate(CustomerContactNotExistByColumnConstraint, {

    })
    public firstname?: string;

    /**
     * Email of contact
     */
    @IsOptional()
    @IsEmail()
    @Validate(CustomerContactNotExistByColumnConstraint, {

    })
    public email?: string;

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
    public active?: boolean;

}