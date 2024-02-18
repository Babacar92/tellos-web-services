import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { CustomerNoteExistConstraint } from "../../constraints/customer-note.exist.constraint";
import { Transform } from "class-transformer";
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { CustomerExistConstraint } from "src/modules/customer/constraints/customer.exist.constraint";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { GraphqlFilesUploadMultipleValidate } from "src/libs/upload/decorators/validators/GraphqlFilesUploadMultipleValidate";
import { LoginEntity } from "src/entities/psql/LoginEntity";

/**
 * Input for to update a new Quick Access
 */
export class CustomerNoteUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(CustomerNoteExistConstraint, {

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
     * Comment of note
     */
    @IsOptional()
    @IsString()
    public comment?: string;

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
    public active?: boolean;

}