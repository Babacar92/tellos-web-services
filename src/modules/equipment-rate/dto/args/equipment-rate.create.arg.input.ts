import { IsBoolean, IsNumber, IsOptional, Validate } from 'class-validator';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { Transform } from 'class-transformer';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { WorkUnitExistConstraint } from 'src/modules/work-unit/constraints/work-unit.exist.constraint';
import { WorkUnitEntity } from 'src/entities/psql/WorkUnitEntity';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { CategoryEquipmentExistConstraint } from 'src/modules/category-equipment/constraints/category-equipment.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class EquipmentRateCreateArgInput {
    /**
     * The initial price
     */
    @IsNumber()
    public price?: number;

    /**
     * The entity to which the equipment rate is applied
     */
    @Validate(EntityExistConstraint)
    @Transform(({ value }) => EntityEntity.init(value))
    public entity?: EntityEntity;

    /**
     * The work unit applied to the equipment rate
     */
    @Validate(WorkUnitExistConstraint)
    @Transform(({ value }) => WorkUnitEntity.init(value))
    public workUnit?: WorkUnitEntity;

    /**
     * The category equipment to which is applied the equipment rate
     */
    @Validate(CategoryEquipmentExistConstraint)
    @Transform(({ value }) => CategoryEquipment.init(value))
    public categoryEquipment?: CategoryEquipment;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active = true;
}
