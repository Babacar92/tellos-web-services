import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { QualificationEntity } from './QualificationEntity';
import { QualificationTypeEntity } from './QualificationTypeEntity';

@Entity({ name: 'qualification_name' })
@Unique(['name', 'deletedAt'])
export class QualificationNameEntity {
  /**
   * The constructor of department Entity
   * @param data
   */
  public constructor(data?: QualificationNameEntity) {
    if (data) Object.assign(this, data);
  }

  /**
   * The id of qualification
   */
  @PrimaryGeneratedColumn()
  public id?: number;

  /**
   * The target type
   */
  @ManyToOne(() => QualificationTypeEntity, (type) => type.names, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  public type?: QualificationTypeEntity;

  /**
   * List of qualifications
   */
  @OneToMany(
    () => QualificationEntity,
    (qualification) => qualification.name,
    {},
  )
  public qualifications?: QualificationEntity;

  /**
   * Name of qualification name
   */
  @Column({
    nullable: true,
  })
  public name?: string;

  /**
   * Validity in month of qualification name
   */
  @Column({
    type: 'int',
    nullable: true,
    unsigned: true,
  })
  public validity?: number;
  /**
   * Is enable
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
   * Return an instance of QualificationNameEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): QualificationNameEntity {
    return id ? new QualificationNameEntity({ id: id }) : null;
  }
}
