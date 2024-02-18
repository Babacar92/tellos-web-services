import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { LoginEntity } from './LoginEntity';
import { BusinessDocumentClassificationEntity } from './BusinessDocumentClassificationEntity';
import { BusinessDocumentTypeEntity } from './BusinessDocumentTypeEntity';
import { UploadEntity } from './UploadEntity';
import { BusinessEntity } from './BusinessEntity';

@Entity({ name: 'business_document' })
export class BusinessDocumentEntity {
    public constructor(data?: BusinessDocumentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * The id
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The business
     */
    @ManyToOne(() => BusinessEntity, (business) => business.documents, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    public business?: BusinessEntity;

    /**
     * Type of document
     */
    @ManyToOne(() => BusinessDocumentTypeEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public type?: BusinessDocumentTypeEntity;

    /**
     * Classification of document
     */
    @ManyToOne(() => BusinessDocumentClassificationEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public classification?: BusinessDocumentClassificationEntity;

    /**
     * User login of document
     */
    @ManyToOne(() => LoginEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public login?: LoginEntity;

    /**
     * File of document
     */
    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public file?: UploadEntity;

    /**
     * The label
     */
    @Column({
        nullable: true,
    })
    public label?: string;

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
        return !!value.match(/^(title|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of BusinessDocumentEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): BusinessDocumentEntity {
        return id ? new BusinessDocumentEntity({ id: id }) : null;
    }
}
