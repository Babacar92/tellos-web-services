import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Validate,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { WorkforceRateExistConstraint } from '../../constraints/workforce-rate.exist.constraint';
import { EntityExistConstraint } from '../../../entity/constraints/entity.exist.constraint';
import { EntityEntity } from '../../../../entities/psql/EntityEntity';
import { WorkUnitExistConstraint } from '../../../work-unit/constraints/work-unit.exist.constraint';
import { WorkUnitEntity } from '../../../../entities/psql/WorkUnitEntity';
import { SectionCodeExistConstraint } from '../../../section-code/constraints/section-code.exist.constraint';
import { SectionCodeEntity } from '../../../../entities/psql/SectionCodeEntity';
import { SectionCodeForWorkforceRateConstraint } from 'src/modules/section-code/constraints/section-code.for.workforce.rate.constraint';

/**
 * Input for to update a new Quick Access
 */
export class WorkforceRateUpdateArgInput {
  /**
   * The id of Quick Access
   */
  @IsNotEmpty()
  @Validate(WorkforceRateExistConstraint, {})
  public id: number;

  /**
   * The initial price
   */
  @IsNumber()
  public price?: number;

  /**
   * The entity to which the workforce rate is applied
   */
  @Validate(EntityExistConstraint)
  @Transform(({value}) => EntityEntity.init(value))
  public entity?: EntityEntity;

  /**
   * The work unit applied to the workforce rate
   */
  @Validate(WorkUnitExistConstraint)
  @Transform(({value}) => WorkUnitEntity.init(value))
  public workUnit?: WorkUnitEntity;

  /**
   * The section code to which is applied the workforce rate
   */
  @Validate(SectionCodeExistConstraint)
  @Validate(SectionCodeForWorkforceRateConstraint)
  @Transform(({value}) => SectionCodeEntity.init(value))
  public sectionCode?: SectionCodeEntity;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
