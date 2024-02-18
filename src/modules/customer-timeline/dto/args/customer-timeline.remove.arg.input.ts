import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { CustomerTimelineEntity } from "src/entities/psql/CustomerTimelineEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { CustomerTimelineExistConstraint } from "../../constraints/customer-timeline.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class CustomerTimelineRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(CustomerTimelineExistConstraint, {

    })
    @Transform(({ value }) => CustomerTimelineEntity.init(value))
    public id?: number | CustomerTimelineEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}