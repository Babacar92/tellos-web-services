import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { NotificationTypeEntity } from "src/entities/psql/NotificationTypeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { NotificationTypeExistConstraint } from "../../constraints/notification-type.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class NotificationTypeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(NotificationTypeExistConstraint, {

    })
    @Transform(({ value }) => NotificationTypeEntity.init(value))
    public id?: number | NotificationTypeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}