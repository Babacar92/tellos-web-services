import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { ExpensePostEntity } from 'src/entities/psql/ExpensePostEntity';
import { ExpensePostExistConstraint } from 'src/modules/expense-post/constraints/expense-post.exist.constraint';
import { InseeCodeNotExistByColumnConstraint } from '../../constraints/insee-code.not.exist.by.column.constraints';

/**
 * Input for to create a new Insee Code
 */
export class InseeCodeCreateArgInput {
  /**
   * Insee Code
   */
  @Validate(InseeCodeNotExistByColumnConstraint, {})
  @IsOptional()
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
  public active?: boolean = true;
}
