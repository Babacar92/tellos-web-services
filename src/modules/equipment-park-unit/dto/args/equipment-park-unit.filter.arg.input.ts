import { IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Work Unit
 */
export class EquipmentParkUnitFilterArgInput extends DatabaseFilterArg {
  /**
   * The target title for filter
   */
  @IsOptional()
  @IsString()
  public title?: string;

  /**
   * The target titles for filter
   */
  @IsOptional()
  @IsString({
    each: true,
  })
  public titles?: string[];

  /**
   * The division factor
   */
  @IsOptional()
  @IsInt()
  public divisionFactor: number;

  @IsOptional()
  @IsInt({
    each: true,
  })
  public divisionFactors: number[]; 
}
