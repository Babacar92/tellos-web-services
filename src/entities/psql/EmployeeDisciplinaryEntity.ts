import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Employee } from './EmployeeEntity';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UploadEntity } from './UploadEntity';

@Entity({
    name: 'employee_disciplinary',
})
export class EmployeeDisciplinaryEntity {
    /**
     * The constructor of EmployeeDisciplinaryEntity
     * @param data
     */
    public constructor(data?: EmployeeDisciplinaryEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * comment
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public comment?: string;

    /**
     * document
     */
    @ManyToMany(() => UploadEntity, {
        onDelete: 'CASCADE',
    })
    @JoinTable()
    public files?: UploadEntity[];

    /**
     * Employe
     */
    @ManyToOne(() => Employee, (employee) => employee.employeeDisciplinarys, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public employee?: Employee;

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
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(comment|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of EmployeeDisciplinaryEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EmployeeDisciplinaryEntity {
        return id ? new EmployeeDisciplinaryEntity({ id: id }) : null;
    }
}
