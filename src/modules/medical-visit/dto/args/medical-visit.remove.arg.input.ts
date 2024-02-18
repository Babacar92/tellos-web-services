import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { MedicalVisitExistConstraint } from "../../constraints/medical-visit.exist.constraint";
import { MedicalVisitEntity } from "src/entities/psql/MedicalVisitEntity";

/**
 * Input for to remove a Career Path
 */
export class MedicalVisitRemoveArgInput {

    /**
     * Id of Career Path
     */
    @Validate(MedicalVisitExistConstraint, {

    })
    @Transform(({ value }) => MedicalVisitEntity.init(value))
    public id?: number | MedicalVisitEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}