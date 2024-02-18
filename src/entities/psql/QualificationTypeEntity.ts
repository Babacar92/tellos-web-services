import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { QualificationEntity } from './QualificationEntity';
import { QualificationNameEntity } from './QualificationNameEntity';

@Entity({ name: 'qualification_type' })
@Unique(['name', 'deletedAt'])
export class QualificationTypeEntity {
  /**
   * The constructor of department Entity
   * @param data
   */
  public constructor(data?: QualificationTypeEntity) {
    if (data) Object.assign(this, data);
  }

  /**
   * The id of qualification
   */
  @PrimaryGeneratedColumn()
  public id?: number;

  /**
   * List of qualifications
   */
  @OneToMany(
    () => QualificationEntity,
    (qualification) => qualification.type,
    {},
  )
  public qualifications?: QualificationEntity;

  /**
   * List of qualifications
   */
  @OneToMany(() => QualificationNameEntity, (name) => name.type, {})
  public names?: QualificationEntity;

  /**
   * Name of qualification type
   */
  @Column({
    nullable: true,
  })
  public name?: string;

  /**
   * Is enable
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
    return !!value.match(/^(name|createdBy|updatedBy)$/i);
  }

  /**
   * Return an instance of QualificationTypeEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): QualificationTypeEntity {
    return id ? new QualificationTypeEntity({ id: id }) : null;
  }
}
