import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { SupplierCategoryNotExistByColumnConstraint } from '../../constraints/supplier-category.not.exist.by.column.constraints';
import { SupplierCategoryExistConstraint } from '../../constraints/supplier-category.exist.constraint';

/**
 * Input for to update a new supplier-category
 */
export class SupplierCategoryUpdateArgInput {
  /**
   * The id of supplier category
   */
  @IsNotEmpty()
  @Validate(SupplierCategoryExistConstraint, {})
  public id: number;

  /**
   * The name of supplier category
   */
  @IsOptional()
  @IsString()
  @Validate(SupplierCategoryNotExistByColumnConstraint, {})
  public name?: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
