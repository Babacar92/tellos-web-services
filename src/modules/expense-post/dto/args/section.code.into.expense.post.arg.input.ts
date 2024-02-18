import { IsInt, Validate } from 'class-validator';
import { ExpensePostExistConstraint } from '../../constraints/expense-post.exist.constraint';
import { SectionCodeExistConstraint } from '../../../section-code/constraints/section-code.exist.constraint';

/**
 * The request data for to add section code into expense post
 */
export class SectionCodeIntoExpensePostArgInput {
  /**
   * Expense post id
   */
  @IsInt()
  @Validate(ExpensePostExistConstraint, {})
  public expensePostId: number;

  /**
   * Expense post id
   */
  @IsInt()
  @Validate(SectionCodeExistConstraint, {})
  public sectionCodeId: number;
}
