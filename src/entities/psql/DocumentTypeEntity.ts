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
import { EmployeeDocumentEntity } from './EmployeeDocumentEntity';
import { DocumentCategoryEntity } from './DocumentCategoryEntity';
import { EquipmentDocumentEntity } from './EquipmentDocumentEntity';

@Entity({ name: 'document_type' })
@Unique(['title', 'deletedAt'])
export class DocumentTypeEntity {
  /**
   * The constructor of Entity Entity
   * @param data
   */
  public constructor(data?: DocumentTypeEntity) {
    if (data) Object.assign(this, data);
  }

  /**
   * Id of document
   */
  @PrimaryGeneratedColumn()
  public id?: number;

  /**
   * Title of Document Tag
   */
  @Column({
    nullable: true,
  })
  public title?: string;

  /**
   * Category of Document
   */
  @ManyToOne(() => DocumentCategoryEntity, (category) => category.types, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  public category?: DocumentCategoryEntity;

  /**
   * Documents of Document Tag
   */
  @OneToMany(() => EmployeeDocumentEntity, (doc) => doc.type)
  public documents?: EmployeeDocumentEntity[];

  /**
   * list of equipment document
   */
  @OneToMany(() => EquipmentDocumentEntity, equipmentDocument => equipmentDocument.documentType, {

  })
  public equipmentDocuments?: EquipmentDocumentEntity[];

  /**
   * Active mode of Document Tag
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
   * Return an instance of DocumentTypeEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): DocumentTypeEntity {
    return id ? new DocumentTypeEntity({ id: id }) : null;
  }
}
