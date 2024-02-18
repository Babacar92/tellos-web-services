import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { NotificationEntity } from "src/entities/psql/NotificationEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { NotificationExistConstraint } from "../../constraints/notification.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class NotificationRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(NotificationExistConstraint, {

    })
    @Transform(({ value }) => NotificationEntity.init(value))
    public id?: number | NotificationEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}