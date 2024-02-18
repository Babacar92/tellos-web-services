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
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { Good } from './good.entity';

@Entity({
    name: 'work_entity',
})
@Unique(['title', 'deletedAt'])
export class WorkUnitEntity {
    /**
     * The constructor of Category Equipment
     * @param data
     */
    public constructor(data?: WorkUnitEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Category Equipment
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The title
     */
    @Column({
        nullable: true,
    })
    public title?: string;

    /**
     * The division factor
     */
    @Column({
        nullable: true,
    })
    public divisionFactor?: number;

    /**
     * List of goods attached to the work unit
     */
    @OneToMany(() => Good, (good) => good.workUnit, {})
    public goods?: Good[];

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
        return !!value.match(/^(title|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of WorkUnitEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): WorkUnitEntity {
        return id ? new WorkUnitEntity({ id: id }) : null;
    }
}
