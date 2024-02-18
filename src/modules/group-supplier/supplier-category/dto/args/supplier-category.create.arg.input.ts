import { IsBoolean, IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { SupplierCategoryNotExistByColumnConstraint } from '../../constraints/supplier-category.not.exist.by.column.constraints';

/**
 * Input for to create a new supplier-category
 */
export class SupplierCategoryCreateArgInput {
  /**
   * The title of supplier-category
   */
  @IsString()
  @Validate(SupplierCategoryNotExistByColumnConstraint, {})
  public name: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active = true;
}
