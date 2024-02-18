import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { SectionCodeEntity } from './SectionCodeEntity';

@Entity({
  name: 'expense_post',
})
export class ExpensePostEntity {
  /**
   * The constructor of Expense post
   * @param data
   */
  public constructor(data?: ExpensePostEntity) {
    if (data) Object.assign(this, data);
  }

  /**
   * Id of Expense post
   */
  @PrimaryGeneratedColumn()
  public id?: number;

  /**
   * Name of Expense post
   */
  @Column()
  public name?: string;

  /**
   * List of section code
   */
  @OneToMany(
    () => SectionCodeEntity,
    (sectionCode) => sectionCode.expensePost,
    {},
  )
  public sectionCodes?: SectionCodeEntity[];

  /**
   * Active mode of Expense post
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  public active?: boolean;

  /**
   * Created column
   */
  @CreateDateColumn({
    // ...
  })
  public createdAt?: Date;

  /**
   * Updated column
   */
  @UpdateDateColumn({
    // ...
  })
  public updatedAt?: Date;

  /**
   * Deleted column
   */
  @DeleteDateColumn({
    //
  })
  public deletedAt?: Date;

  /**
   * Creator column
   */
  @CreatedByColumn()
  public createdBy?: string;

  /**
   * Editor column
   */
  @UpdatedByColumn()
  public updatedBy?: string;

  /**
   * Check if column name is string
   */
  public static isColumnString(value: string): boolean {
    return !!value.match(/^(name|createdBy|updatedBy)$/i);
  }

  /**
   * Return an instance of ExpensePostEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): ExpensePostEntity {
    return id ? new ExpensePostEntity({ id: id }) : null;
  }
}
