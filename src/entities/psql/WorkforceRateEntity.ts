import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { EntityEntity } from './EntityEntity';
import { WorkUnitEntity } from './WorkUnitEntity';
import { SectionCodeEntity } from './SectionCodeEntity';

@Entity({
  name: 'workforce_rate',
})
@Unique(['sectionCode', 'entity', 'deletedAt'])
export class WorkforceRateEntity {
  /**
   * The constructor of Category Equipment
   * @param data
   */
  public constructor(data?: WorkforceRateEntity) {
    if (data) Object.assign(this, data);
  }

  /**
   * Id of Category Equipment
   */
  @PrimaryGeneratedColumn()
  public id?: number;

  @ManyToOne(() => EntityEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  public entity?: EntityEntity;


  @ManyToOne(() => WorkUnitEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  public workUnit?: WorkUnitEntity;

  @ManyToOne(() => SectionCodeEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  public sectionCode?: SectionCodeEntity;

   /**
   * the price
   */
   @Column({
    type: 'numeric',
    nullable: true,
    precision: 14,
    scale: 5,
  })
  public price?: number;

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
    return !!value.match(/^(title|createdBy|updatedBy)$/i);
  }

  /**
   * Return an instance of WorkforceRateEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): WorkforceRateEntity {
    return id ? new WorkforceRateEntity({ id: id }) : null;
  }
}
