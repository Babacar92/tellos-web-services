import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { JobDescriptionExistConstraint } from "../../constraints/job-description.exist.constraint";
import { JobDescriptionEntity } from "src/entities/psql/JobDescriptionEntity";

/**
 * Input for to create a new Job Description
 */
export class JobDescriptionRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(JobDescriptionExistConstraint, {

    })
    @Transform(({ value }) => JobDescriptionEntity.init(value))
    public id?: number | JobDescriptionEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}