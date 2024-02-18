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
import { Employee } from './EmployeeEntity';

/**
 * Quick Access Entity
 */
@Entity({
    name: 'quick_access',
})
export class QuickAccessEntity {
    /**
     * The constructor of Permission Entity
     * @param data
     */
    public constructor(data?: QuickAccessEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Quick Access
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The employee of Quick Access
     */
    @ManyToOne(() => Employee, (employee) => employee.quickAccess, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * The label of Quick Access
     */
    @Column({
        length: 255,
        nullable: true,
    })
    public label?: string;

    /**
     * The link of Quick Access
     */
    @Column({
        length: 255,
        nullable: true,
    })
    public link?: string;

    /**
     * The color of Quick Access
     */
    @Column({
        length: 100,
        nullable: true,
    })
    public color?: string;

    /**
     * The icon of Quick Access
     */
    @Column({
        length: 100,
        nullable: true,
    })
    public icon?: string;

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
        return !!value.match(/^(label|link|color|icon|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of QuickAccessEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): QuickAccessEntity {
        return id ? new QuickAccessEntity({ id: id }) : null;
    }
}
