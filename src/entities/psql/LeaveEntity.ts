import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { Employee } from './EmployeeEntity';
import { getnumberDays, getYear } from 'src/utils/utils';
import { LEAVE_ICON } from 'src/modules/leave/dto/enums/leave.decision.enum';
import { DepartmentEntity } from './DepartmentEntity';
import { ContractEnum } from 'src/modules/employee/dto/enums/employee.contract.enum';
import { EmployeeSexEnum } from 'src/modules/employee/dto/enums/employee.sexe.enum';
import {
    LeaveEndDayEnum,
    LeaveStartDayEnum,
} from 'src/modules/leave/dto/enums/leave.day.enum';
import { LeaveDistributionEntity } from './LeaveDistributionEntity';
import { EntityEntity } from './EntityEntity';
import { LeavePeriodEntity } from './LeavePeriodEntity';

@Entity({
    name: 'leave',
})
export class LeaveEntity {
    /**
     * The constructor of Leave Entity
     * @param data
     */
    public constructor(data?: LeaveEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Leave
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Employee who granted Leave
     */
    @ManyToOne(() => Employee, (employee) => employee.leaves, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * Entity of Leave
     */
    @ManyToOne(() => EntityEntity, (entity) => entity.leaves, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public entity?: EntityEntity;

    /**
     * Departement of Employee who granted Leave
     */
    @ManyToOne(() => DepartmentEntity, (service) => service.leaves, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public service?: DepartmentEntity;

    /**
     * leavePeriod
     */
    @ManyToOne(() => LeavePeriodEntity, (leavePeriod) => leavePeriod.leaves, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public leavePeriod?: LeavePeriodEntity;

    /**
     * Decision Maker who granted Leave
     */
    @ManyToOne(() => Employee, null, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public decisionMaker?: Employee;

    /**
     * The distributions
     *
     */
    @OneToMany(
        () => LeaveDistributionEntity,
        (distribution) => distribution.leave,
        {},
    )
    public distributions?: LeaveDistributionEntity[];

    /**
     * Motive of Leave
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public motive?: string;

    /**
     * Start Date  of Leave
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public startDate?: Date;

    /**
     * End Date  of Leave
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public endDate?: Date;

    /**
     * Contract of Employee who granted Leave
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: ContractEnum,
    })
    public contract?: ContractEnum;

    /**
     * Decison for Leave
     */
    @Column({
        type: 'enum',
        enum: LEAVE_ICON,
    })
    public decision?: LEAVE_ICON;

    /**
     * Start Day
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: LeaveStartDayEnum,
    })
    public startDay?: LeaveStartDayEnum;

    /**
     * End Day
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: LeaveEndDayEnum,
    })
    public endDay?: LeaveEndDayEnum;

    /**
     * Gender of Employee
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: EmployeeSexEnum,
    })
    public gender?: EmployeeSexEnum;

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
     * number days of Leave
     */
    public numberDays?: number;

    /**
     * Year of Leave
     */
    public year?: number;

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(motive|createdBy|updatedBy)$/i);
    }
    /**
     * Set values after load
     */
    @AfterLoad()
    public afterLoad?(): void {
        if (this.startDate && this.endDate) {
            this.numberDays = getnumberDays(this.startDate, this.endDate);
        }
        if (this.startDate && this.startDay) {
            this.numberDays = getnumberDays(
                this.startDate,
                this.endDate,
                this.startDay,
                this.endDay,
            );
        }
        if (this.startDate && this.endDate && this.startDay && this.endDay) {
            this.numberDays = getnumberDays(
                this.startDate,
                this.endDate,
                this.startDay,
                this.endDay,
            );
        }

        if (this.startDate) {
            this.year = getYear(this.startDate);
        }
    }

    /**
     * Return an instance of LeaveEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): LeaveEntity {
        return id ? new LeaveEntity({ id: id }) : null;
    }
}
