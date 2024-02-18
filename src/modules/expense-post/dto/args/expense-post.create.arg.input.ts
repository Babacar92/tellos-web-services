import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { ExpensePostNotExistByColumnConstraint } from '../../constraints/expense-post.not.exist.by.column.constraints';

/**
 * Input for to create a new Expense Post
 */
export class ExpensePostCreateArgInput {
  /**
   * Name of Expense Post
   */
  @IsOptional()
  @IsString()
  @Validate(ExpensePostNotExistByColumnConstraint, {})
  public name?: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active = true;
}
