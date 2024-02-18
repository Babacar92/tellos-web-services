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
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { Employee } from './EmployeeEntity';
import { LeaveEntity } from './LeaveEntity';
import { calculateBalance } from 'src/utils/utils';

@Entity({
    name: 'leave_period',
})
export class LeavePeriodEntity {
    /**
     * The constructor of LeavePeriod
     * @param data
     */
    public constructor(data?: LeavePeriodEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Leave Period
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * date From Leave Period
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public dateFrom?: Date;

    /**
     * date To Leave Period
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public dateTo?: Date;

    /**
     * employee
     */
    @ManyToOne(() => Employee, (employee) => employee.leaveperiods, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * countAcquiredLeave
     */
    @Column({
        type: 'numeric',
        nullable: true,
    })
    public countAcquiredLeave?: number;

    /**
     * countUsableLeave
     */
    @Column({
        type: 'numeric',
        nullable: true,
    })
    public countUsableLeave?: number;

    /**
     * List of Leaves
     */
    @OneToMany(() => LeaveEntity, (leave) => leave.leavePeriod, {})
    public leaves?: LeaveEntity[];

    /**
     * total balance of Leave Period
     */
    public balanceLeave?: number;
    /**
     * Active mode
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

    @AfterLoad()
    public afterLoad?(): void {
        if (this.countAcquiredLeave && this.countUsableLeave) {
            this.balanceLeave = calculateBalance(
                this.countAcquiredLeave,
                this.countUsableLeave,
            );
        }
    }
    /**
     * Return an instance of LeavePeriodEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): LeavePeriodEntity {
        return id ? new LeavePeriodEntity({ id: id }) : null;
    }
}
