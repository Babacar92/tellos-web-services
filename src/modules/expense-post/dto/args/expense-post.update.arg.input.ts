import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ExpensePostNotExistByColumnConstraint } from '../../constraints/expense-post.not.exist.by.column.constraints';
import { ExpensePostExistConstraint } from '../../constraints/expense-post.exist.constraint';
import { SectionCodeEntity } from 'src/entities/psql/SectionCodeEntity';
import { Transform } from 'class-transformer';
import { SectionCodeExistConstraint } from 'src/modules/section-code/constraints/section-code.exist.constraint';

/**
 * Input for to update a Expense Post
 */
export class ExpensePostUpdateArgInput {
  /**
   * The id of Expense Post
   */
  @IsNotEmpty()
  @Validate(ExpensePostExistConstraint, {})
  public id: number;

  /**
   * Name of Expense Post
   */
  @IsOptional()
  @IsString()
  @Validate(ExpensePostNotExistByColumnConstraint, {})
  public name?: string;

  /**
   * Array of section code
   */
  @IsOptional()
  @Validate(SectionCodeExistConstraint, {
    each: true,
  })
  @Transform(({ value }) => value.map((v: number) => SectionCodeEntity.init(v)))
  public sectionCodes?: SectionCodeEntity[];

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
