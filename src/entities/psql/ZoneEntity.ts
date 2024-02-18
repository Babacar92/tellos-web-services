import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';

@Entity({
  name: 'zone',
})
@Unique(['code', 'deletedAt'])
export class ZoneEntity {
  /**
   * The constructor of zone
   * @param data
   */
  public constructor(data?: ZoneEntity) {
    if (data) Object.assign(this, data);
  }

  /**
   * Id of zone
   */
  @PrimaryGeneratedColumn()
  public id?: number;

  /**
   * The code of zone
   */
  @Column({
    nullable: true,
  })
  public code?: string;

  /**
   * Active mode
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
    return !!value.match(/^(code|createdBy|updatedBy)$/i);
  }

  /**
   * Return an instance of ZoneEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): ZoneEntity {
    return id ? new ZoneEntity({ id: id }) : null;
  }
}
