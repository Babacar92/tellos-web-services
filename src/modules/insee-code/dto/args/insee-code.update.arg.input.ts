import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { InseeCodeExistConstraint } from '../../constraints/insee-code.exist.constraint';
import { Transform } from 'class-transformer';
import { ExpensePostExistConstraint } from 'src/modules/expense-post/constraints/expense-post.exist.constraint';
import { ExpensePostEntity } from 'src/entities/psql/ExpensePostEntity';
import { InseeCodeNotExistByColumnConstraint } from '../../constraints/insee-code.not.exist.by.column.constraints';

/**
 * Input for to update a new Insee Code
 */
export class InseeCodeUpdateArgInput {
  /**
   * The id of Comment Contract
   */
  @IsNotEmpty()
  @Validate(InseeCodeExistConstraint, {})
  public id: number;

  /**
   * Insee Code
   */
  @IsOptional()
  @Validate(InseeCodeNotExistByColumnConstraint, {})
  @IsString()
  public code?: string;

  /**
   * Insee Code
   */
  @IsOptional()
  @IsString()
  public name?: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
