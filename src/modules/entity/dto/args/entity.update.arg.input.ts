import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { GraphqlFileUploadValidate } from "src/libs/upload/decorators/validators/GraphqlFileUploadValidate";
import { EntityExistConstraint } from "../../constraints/entity.exist.constraint";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { EntityNotExistByColumnConstraint } from "../../constraints/entity.not.exist.by.column.constraints";
import { EntityType } from "../enum/entity.type.enum";

/**
 * Input for to update a new Quick Access
 */
export class EntityUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(EntityExistConstraint, {

    })
    public id: number;

    /**
     * The label of entity
     */
    @IsOptional()
    @IsString()
    @Validate(EntityNotExistByColumnConstraint, {

    })
    public label?: string;

    /**
     * The identifierNumber of entity
     */
    @IsString()
    @Validate(EntityNotExistByColumnConstraint, {})
    public identifierNumber: string;

    /**
     * The label of Quick Access
     */
    @IsOptional()
    @IsString()
    public colorGradiantLeft?: string;

    /**
     * The label of Quick Access
     */
    @IsOptional()
    @IsString()
    public colorGradiantRight?: string;

    /**
     * The label of Quick Access
     */
    @IsOptional()
    @IsString()
    public colorHeader?: string;

    /**
     * The label of Quick Access
     */
    @IsOptional()
    @IsString()
    public colorSticker?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

    /**
     * Uploaded Logo
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['jpg', 'png', 'jpeg', 'jfif'],
    })
    public logo?: GraphqlFileUpload;

    /**
     * Uploaded Organigramme
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['jpg', 'png', 'jpeg', 'jfif'],
    })
    public organigramme?: GraphqlFileUpload;

    /**
     * Description
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value ? value : null)
    public description?: string;

    /**
     * Linkedin
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value ? value : null)
    public linkedin?: string;

    /**
     * Creation Date
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public creationDate?: Date;

    /**
     * The count totalEmployees
     */
    @IsOptional()
    @IsInt()
    public totalEmployees?: number;

    /**
     * Type of entity
     */
    @IsString()
    @IsOptional()
    @IsEnum(EntityType)
    @Transform(({ value }) => value ? value : null)
    public type?: string;

    /**
     * The memembership number of entity CIBTP
     */
    @IsOptional()
    @IsString()
    public membershipNumber?: string;

}