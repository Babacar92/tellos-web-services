import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';


@Unique(['code', 'deletedAt'])
@Entity({
  name: 'insee_code',
})
export class InseeCodeEntity {
  /**
   * The constructor of Insee code
   * @param data
   */
  public constructor(data?: InseeCodeEntity) {
    if (data) Object.assign(this, data);
  }

  /**
   * Id of Insee code
   */
  @PrimaryGeneratedColumn()
  public id?: number;

  /**
   * Code of Insee code
   */
  @Column({
    nullable: true,
  })
  public code?: string;

  /**
   * name of Insee code
   */
  @Column({
    nullable: true,
  })
  public name?: string;


  /**
   * Active mode of Insee code
   */
  @Column({
    type: 'boolean',
    default: true,
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
    return !!value.match(
      /^(code|designation|inventoryChangeAccount|createdBy|updatedBy)$/i,
    );
  }

  /**
   * Return an instance of InseeCodeEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): InseeCodeEntity {
    return id ? new InseeCodeEntity({ id: id }) : null;
  }
}
