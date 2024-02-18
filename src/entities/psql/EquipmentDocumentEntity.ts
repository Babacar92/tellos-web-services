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
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { Employee } from './EmployeeEntity';
import { DocumentTypeEntity } from './DocumentTypeEntity';

@Entity({
    name: 'equipment_document',
})
export class EquipmentDocumentEntity {
    /**
     * The constructor of Equipment Document
     * @param data
     */
    public constructor(data?: EquipmentDocumentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Equipment Document
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Title of equipment document
     */
    @Column()
    public title?: string;

    /**
     * Description of equipment document
     */
    @Column()
    public description?: string;

    /**
     * Employee of Equipment Document
     */
    @ManyToOne(() => Employee, (employee) => employee.equipmentDocument, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * Document Type of Equipment Document
     */
    @ManyToOne(
        () => DocumentTypeEntity,
        (employee) => employee.equipmentDocuments,
        {
            nullable: true,
            onDelete: 'SET NULL',
        },
    )
    @JoinColumn()
    public documentType?: DocumentTypeEntity;

    /**
     * startDate
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public startDate?: Date;

    /**
     * endDate
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public endDate?: Date;

    /**
     * Active mode
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
        return !!value.match(/^(title|description|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of EquipmentDocumentEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EquipmentDocumentEntity {
        return id ? new EquipmentDocumentEntity({ id: id }) : null;
    }
}
