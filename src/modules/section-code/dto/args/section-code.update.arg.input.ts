import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { SectionCodeExistConstraint } from '../../constraints/section-code.exist.constraint';
import { Transform } from 'class-transformer';
import { ExpensePostExistConstraint } from 'src/modules/expense-post/constraints/expense-post.exist.constraint';
import { ExpensePostEntity } from 'src/entities/psql/ExpensePostEntity';
import { SectionCodeNotExistByColumnConstraint } from '../../constraints/section-code.not.exist.by.column.constraints';

/**
 * Input for to update a new Section Code
 */
export class SectionCodeUpdateArgInput {
  /**
   * The id of Comment Contract
   */
  @IsNotEmpty()
  @Validate(SectionCodeExistConstraint, {})
  public id: number;

  /**
   * Section code
   */
  @IsOptional()
  @Validate(SectionCodeNotExistByColumnConstraint, {})
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
   * purchaseAccount
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
  public active?: boolean;
}
