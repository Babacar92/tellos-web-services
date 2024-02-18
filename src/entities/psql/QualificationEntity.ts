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
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { DepartmentEntity } from './DepartmentEntity';
import { Employee } from './EmployeeEntity';
import { EntityEntity } from './EntityEntity';
import { QualificationNameEntity } from './QualificationNameEntity';
import { QualificationTypeEntity } from './QualificationTypeEntity';
import { UploadEntity } from './UploadEntity';
import { QualificationStatusEnum } from '../../modules/qualification/dto/enums/qualification.status.enum';

@Entity({ name: 'qualification' })
@Unique(['number', 'deletedAt'])
export class QualificationEntity {
    /**
     * The constructor of department Entity
     * @param data
     */
    public constructor(data?: QualificationEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * The id of qualification
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The entity of Qualification
     */
    @ManyToOne(() => EntityEntity, (entity) => entity.qualifications, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public entity?: EntityEntity;

    /**
     * Department of Qualification
     */
    @ManyToOne(
        () => DepartmentEntity,
        (department) => department.qualifications,
        {
            nullable: true,
            onDelete: 'SET NULL',
        },
    )
    @JoinColumn()
    public department?: DepartmentEntity;

    /**
     * Employee of Qualification
     */
    @ManyToOne(() => Employee, (employee) => employee.qualifications, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * Type of qualification
     */
    @ManyToOne(() => QualificationTypeEntity, (type) => type.qualifications, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public type?: QualificationTypeEntity;

    /**
     * Type of qualification
     */
    @ManyToOne(() => QualificationNameEntity, (name) => name.qualifications, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public name?: QualificationNameEntity;

    /**
     * Picture of Employee
     */
    @ManyToOne(() => UploadEntity, null, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public document?: UploadEntity;

    /**
     * Number of qualification
     */
    @Column({
        nullable: true,
    })
    public number?: string;

    /**
     * Delivery of qualification
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public delivery?: Date;

    /**
     * Deadline of qualification
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public deadline?: Date;

    /**
     * Validity in month of qualification
     */
    @Column({
        type: 'int',
        nullable: true,
        unsigned: true,
    })
    public validity?: number;

    /**
     * Comment of qualification
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    public comment?: string;

    /**
     * The status
     */
    @Column({
        type: 'enum',
        enum: QualificationStatusEnum,
        default: QualificationStatusEnum.VALIDATED,
        nullable: true,
    })
    public status?: QualificationStatusEnum;

    /**
     * Is from my account
     */
    @Column({
        type: 'boolean',
        nullable: true,
    })
    public fromMyAccount?: boolean;

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
        return !!value.match(
            /^(number|documentName|comment|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Return an instance of QualificationEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): QualificationEntity {
        return id ? new QualificationEntity({ id: id }) : null;
    }
}
