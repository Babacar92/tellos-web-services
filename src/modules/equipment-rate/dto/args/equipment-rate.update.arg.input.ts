import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    Validate,
    IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EquipmentRateExistConstraint } from '../../constraints/equipment-rate.exist.constraint';
import { EntityExistConstraint } from '../../../entity/constraints/entity.exist.constraint';
import { EntityEntity } from '../../../../entities/psql/EntityEntity';
import { WorkUnitExistConstraint } from '../../../work-unit/constraints/work-unit.exist.constraint';
import { WorkUnitEntity } from '../../../../entities/psql/WorkUnitEntity';
import { CategoryEquipmentExistConstraint } from 'src/modules/category-equipment/constraints/category-equipment.exist.constraint';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';

/**
 * Input for to update a new Equipment Rate
 */
export class EquipmentRateUpdateArgInput {
    /**
     * The id of Equipment Rate
     */
    @IsNotEmpty()
    @Validate(EquipmentRateExistConstraint, {})
    public id: number;

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
     * The section code to which is applied the equipment rate
     */
    @Validate(CategoryEquipmentExistConstraint)
    @Transform(({ value }) => CategoryEquipment.init(value))
    public categoryEquipment?: CategoryEquipment;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
