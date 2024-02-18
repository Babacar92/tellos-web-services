import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { CustomerExistConstraint } from "src/modules/customer/constraints/customer.exist.constraint";
import { LoginEntity } from "src/entities/psql/LoginEntity";
import { GraphqlFilesUploadMultipleValidate } from "src/libs/upload/decorators/validators/GraphqlFilesUploadMultipleValidate";

/**
 * Input for to create a new Quick Access
 */
export class CustomerNoteCreateArgInput {

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
     * Comment of note
     */
    @IsString()
    public comment: string;

    /**
     * Uploaded Icon
     */
    @IsOptional()
    @GraphqlFilesUploadMultipleValidate({
    })
    public documents?: GraphqlFileUpload[];

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}