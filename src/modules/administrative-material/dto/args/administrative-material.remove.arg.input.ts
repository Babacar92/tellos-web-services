import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { AdministrativeMaterialEntity } from "src/entities/psql/AdministrativeMaterialEntity";
import { AdministrativeMaterialExistConstraint } from "../../constraints/administrative-material.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class AdministrativeMaterialRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(AdministrativeMaterialExistConstraint, {

    })
    @Transform(({ value }) => AdministrativeMaterialEntity.init(value))
    public id?: number | AdministrativeMaterialEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}