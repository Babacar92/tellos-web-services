import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Quick Access
 */
export class EquipmentRateFilterArgInput extends DatabaseFilterArg {
  /**
   * The target id for filter
   */
  @IsOptional()
  @IsInt()
  public id?: number;

  /**
   * The target ids for filter
   */
  @IsOptional()
  @IsInt({
    each: true
  })
  public ids?: number[];
}
