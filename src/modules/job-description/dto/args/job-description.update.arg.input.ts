import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { JobDescriptionExistConstraint } from "../../constraints/job-description.exist.constraint";
import { DepartmentEntity } from "src/entities/psql/DepartmentEntity";
import { DepartmentExistConstraint } from "src/modules/department/constraints/department.exist.constraint";
import { Transform } from "class-transformer";
import { EntityExistConstraint } from "../../../entity/constraints/entity.exist.constraint";
import { EntityEntity } from "../../../../entities/psql/EntityEntity";
import { GraphqlFileUploadValidate } from "@/libs/upload/decorators/validators/GraphqlFileUploadValidate";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';

/**
 * Input for to update a new Job Description
 */
export class JobDescriptionUpdateArgInput {

    /**
     * The id of Job Description
     */
    @IsNotEmpty()
    @Validate(JobDescriptionExistConstraint, {

    })
    public id: number;

    /**
     * Entity company Job Description
     */
    @IsOptional()
    @Validate(EntityExistConstraint, {

    })
    @Transform(({ value }) => EntityEntity.init(value))
    public entity?: EntityEntity;

    /**
     * department Job Description
     */
    @IsOptional()
    @Validate(DepartmentExistConstraint, {

    })
    @Transform(({ value }) => DepartmentEntity.init(value))
    public department?: DepartmentEntity;

    /**
     * Number
     */
    @IsOptional()
    @IsString()
    public number?: string;

    /**
     * Denomination
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * Denomination
     */
    @IsOptional()
    @IsString()
    public description?: string;

    /**
     * Denomination
     */
    @IsOptional()
    @IsInt()
    public totalEmployees?: number;

    /**
     * Uploaded Icon
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