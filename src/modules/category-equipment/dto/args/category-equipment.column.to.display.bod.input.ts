import { IsOptional, IsString } from 'class-validator';

/**
 * Input for to filter a new Quick Access
 */
export class CategoryEquipmentColumnToDisplayBodInput {
  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public code_c?: string;

  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public title_c?: string;

}
