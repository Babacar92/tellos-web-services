import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LeaveEntity } from "./LeaveEntity";
import { LEAVE_TYPE } from "src/modules/leave-distribution/dto/enums/leave-distribution.type.enum";

@Entity({
    name: "leave_distribution",
})
export class LeaveDistributionEntity {
    /**
     * The constructor of Leave Distribution Entityy
     * @param data 
     */
    public constructor(data?: LeaveDistributionEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Leave Distribution
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Name of type
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: LEAVE_TYPE,
    })
    public name?: LEAVE_TYPE;

    /**
     * Total of leave
     */
    @Column({
        nullable: true,
        type: 'numeric'
    })
    public total?: number;

    /**
     * leave
     */
    @ManyToOne(() => LeaveEntity, leave => leave.distributions, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    public leave?: LeaveEntity;

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
        return !!value.match(/^(createdBy|updatedBy)$/i);
    }


    /**
     * Return an instance of LeaveDistributionEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): LeaveDistributionEntity {
        return id ? new LeaveDistributionEntity({ id: id }) : null;
    }

}