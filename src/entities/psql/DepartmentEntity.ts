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
import { Employee } from './EmployeeEntity';
import { QualificationEntity } from './QualificationEntity';
import { LeaveEntity } from './LeaveEntity';
import { MedicalVisitEntity } from './MedicalVisitEntity';

@Entity({ name: 'department' })
@Unique(['name', 'deletedAt'])
export class DepartmentEntity {
    /**
     * The constructor of department Entity
     * @param data
     */
    public constructor(data?: DepartmentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of department
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * List of Employees
     */
    @OneToMany(() => Employee, (employee) => employee.department, {})
    public employees?: Employee[];

    /**
     * List of qualifications
     */
    @OneToMany(
        () => QualificationEntity,
        (qualification) => qualification.department,
        {},
    )
    public qualifications?: QualificationEntity;

    /**
     * List of Leaves granted
     */
    @OneToMany(() => LeaveEntity, (leave) => leave.service, {})
    public leaves?: LeaveEntity[];

    /**
     * The medical Visits
     */
    @OneToMany(
        () => MedicalVisitEntity,
        (medicalVisit) => medicalVisit.service,
        {},
    )
    public medicalVisits?: MedicalVisitEntity[];

    /**
     * Name of department
     */
    @Column({
        nullable: true,
    })
    public name?: string;

    /**
     * Active mode of department
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
     * Return an instance of DepartmentEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): DepartmentEntity {
        return id ? new DepartmentEntity({ id: id }) : null;
    }
}
