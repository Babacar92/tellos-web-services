import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { WorkforceRateNotExistByColumnConstraint } from '../../constraints/workforce-rate.not.exist.by.column.constraints';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { Transform } from 'class-transformer';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { WorkUnitExistConstraint } from 'src/modules/work-unit/constraints/work-unit.exist.constraint';
import { WorkUnitEntity } from 'src/entities/psql/WorkUnitEntity';
import { SectionCodeExistConstraint } from 'src/modules/section-code/constraints/section-code.exist.constraint';
import { SectionCodeEntity } from 'src/entities/psql/SectionCodeEntity';
import { SectionCodeForWorkforceRateConstraint } from 'src/modules/section-code/constraints/section-code.for.workforce.rate.constraint';

/**
 * Input for to create a new Quick Access
 */
export class WorkforceRateCreateArgInput {

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
  public active = true;
}
