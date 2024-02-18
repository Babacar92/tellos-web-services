import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
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
import { UploadEntity } from './UploadEntity';
import { DocumentTypeEntity } from './DocumentTypeEntity';
import { Employee } from './EmployeeEntity';
import { EMPLOYEE_DOCUMENT_STATUS } from 'src/modules/employee-document/dto/enums/employee-document.status.enum';

@Entity({ name: 'employee_document' })
export class EmployeeDocumentEntity {
    /**
     * The constructor of Entity Entity
     * @param data
     */
    public constructor(data?: EmployeeDocumentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of document
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Type of Document
     */
    @ManyToOne(() => DocumentTypeEntity, (type) => type.documents, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public type?: DocumentTypeEntity;

    /**
     * The file of Document
     */
    @ManyToOne(() => UploadEntity, null, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public file?: UploadEntity;

    /**
     * Employe of document
     */
    @ManyToOne(() => Employee, (employee) => employee.documents, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * Validate or not Date of document
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public validateDate?: Date;

    /**
     * Dunning Date of document
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public dunningDate?: Date;

    /**
     * Dunning Date of document
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public signedDate?: Date;

    /**
     * Status of document
     */
    @Column({
        type: 'enum',
        enum: EMPLOYEE_DOCUMENT_STATUS,
        default: EMPLOYEE_DOCUMENT_STATUS.UPLOADED_FOR_EMPLOYEE,
    })
    public status?: EMPLOYEE_DOCUMENT_STATUS;

    /**
     * Require the employee signature
     */
    @Column({
        type: 'boolean',
        nullable: true,
        default: false,
    })
    public requireEmployeeSignature?: boolean;

    /**
     * Require the employee file
     */
    @Column({
        type: 'boolean',
        nullable: true,
        default: false,
    })
    public requireEmployeeUpload?: boolean;

    /**
     * Active mode of Document
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
        return !!value.match(/^(createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of EmployeeDocumentEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EmployeeDocumentEntity {
        return id ? new EmployeeDocumentEntity({ id: id }) : null;
    }
}
