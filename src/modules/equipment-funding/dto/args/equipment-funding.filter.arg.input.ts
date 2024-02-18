import { IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Quick Access
 */
export class EquipmentFundingFilterArgInput extends DatabaseFilterArg {

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
  @IsString()
  public name?: string;

  /**
   * The target names for filter
   */
  @IsOptional()
  @IsString({
    each: true,
  })
  public names?: string[];

}
