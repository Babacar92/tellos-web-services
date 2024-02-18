import { IsInt, IsOptional } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Quick Access
 */
export class EquipmentTheoricalHourFilterArgInput extends DatabaseFilterArg {

  /**
   * The target id for filter
   */
  @IsOptional()
  @IsInt()
  public id: number;

  /**
   * The target ids for filter
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public ids: number[]; 

  /**
   * The target name for filter
   */
  @IsOptional()
  @IsInt()
  public value?: number;

  /**
   * The target names for filter
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public values?: number[];

}
