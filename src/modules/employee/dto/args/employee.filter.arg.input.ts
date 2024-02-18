import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Validate,
} from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { DepartmentExistConstraint } from 'src/modules/department/constraints/department.exist.constraint';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { QualificationNameExistConstraint } from 'src/modules/qualification-name/constraints/qualification-name.exist.constraint';
import { EmployeeSexEnum } from '../enums/employee.sexe.enum';
import { EmployeeTypeEnum } from '../enums/employee.type.enum';

/**
 * Input for to filter a new Quick Access
 */
export class EmployeeFilterArgInput extends DatabaseFilterArg {
  /**
   * The entities list
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  @Validate(EntityExistConstraint, {
    each: true,
  })
  public entities?: number[];

  /**
   * The departments list
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  @Validate(DepartmentExistConstraint, {
    each: true,
  })
  public departments?: number[];

  /**
   * The contracts list
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public contracts?: number[];

  /**
   * The categories list
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public categories?: number[];

  /**
   * The qualificartions names list
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  @Validate(QualificationNameExistConstraint, {
    each: true,
  })
  public qualificationsNames?: number[];

  /**
   * The genders list
   */
  @IsOptional()
  @IsEnum(EmployeeSexEnum, {
    each: true,
  })
  public genders?: EmployeeSexEnum[];

  /**
   * The statuses list
   */
  @IsOptional()
  @IsBoolean({
    each: true,
  })
  public statuses?: boolean[];

  /**
   * The type
   */
  @IsOptional()
  @IsEnum(EmployeeTypeEnum, {})
  public type?: EmployeeTypeEnum;

  /**
   * The type
   */
  @IsOptional()
  @IsEnum(EmployeeTypeEnum, {
    each: true,
  })
  public types?: EmployeeTypeEnum[];

  /**
   * Has not login
   */
  @IsOptional()
  @IsBoolean()
  public hasNotLogin?: boolean;
}
