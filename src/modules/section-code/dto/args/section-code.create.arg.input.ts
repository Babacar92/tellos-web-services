import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { ExpensePostEntity } from 'src/entities/psql/ExpensePostEntity';
import { ExpensePostExistConstraint } from 'src/modules/expense-post/constraints/expense-post.exist.constraint';
import { SectionCodeNotExistByColumnConstraint } from '../../constraints/section-code.not.exist.by.column.constraints';

/**
 * Input for to create a new Section Code
 */
export class SectionCodeCreateArgInput {
  /**
   * Section code
   */
  @Validate(SectionCodeNotExistByColumnConstraint, {})
  @IsOptional()
  @IsString()
  public code?: string;

  /**
   * Section code
   */
  @IsOptional()
  @IsString()
  public designation?: string;

  /**
   * inventoryChangeAccount
   */
  @IsOptional()
  @IsString()
  public inventoryChangeAccount?: string;

  /**
   * Expense Post
   */
  @IsOptional()
  @Validate(ExpensePostExistConstraint, {})
  @Transform(({ value }) => ExpensePostEntity.init(value))
  public expensePost?: ExpensePostEntity;

  /**
   * purchaseAccounts
   */
  @IsOptional()
  @IsString({
    each: true,
  })
  @Transform(({ value }) => value?.split(',')?.map((v: string) => v.trim()))
  public purchaseAccounts?: string[];

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean = true;
}
