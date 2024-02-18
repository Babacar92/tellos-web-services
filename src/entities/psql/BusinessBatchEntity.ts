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
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { BusinessEntity } from './BusinessEntity';
import { BusinessBatchStatusEntity } from './BusinessBatchStatusEntity';
import { Employee } from './EmployeeEntity';

@Entity({ name: 'business_batch' })
export class BusinessBatchEntity {
    public constructor(data?: BusinessBatchEntity) {
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
    @ManyToOne(() => BusinessEntity, (business) => business.batches, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    public business?: BusinessEntity;

    /**
     * The status
     */
    @ManyToOne(() => BusinessBatchStatusEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public status?: BusinessBatchStatusEntity;

    /**
     * The commercial
     */
    @ManyToOne(() => Employee, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public commercial?: Employee;

    /**
     * The label
     */
    @Column({
        nullable: true,
    })
    public label?: string;

    /**
     * The apology
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public apology?: string;

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
    public static isColumnString(value?: string): boolean {
        return !!value?.match(/^(label|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of BusinessBatchEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): BusinessBatchEntity {
        return id ? new BusinessBatchEntity({ id: id }) : null;
    }
}
