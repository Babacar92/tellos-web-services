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
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { UploadEntity } from './UploadEntity';
import { Employee } from './EmployeeEntity';
import { CAREER_ICON_PATH } from 'src/modules/career-path/dto/enums/career-path.icon.enum';
import { MedicalVisitEntity } from './MedicalVisitEntity';

@Entity({
    name: 'career_path',
})
export class CareerPathEntity {
    /**
     * The constructor of Career Path Entity
     * @param data
     */
    public constructor(data?: CareerPathEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of CareerPath
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Title of CareerPath
     */
    @Column()
    public title?: string;

    /**
     * icon of CareerPath
     */
    @Column({
        type: 'enum',
        enum: CAREER_ICON_PATH,
    })
    public icon?: CAREER_ICON_PATH;

    /**
     * startDate of CareerPath
     */
    @Column({
        nullable: true,
        type: 'timestamptz',
    })
    public startDate?: Date;

    /**
     * endDate of CareerPath
     */
    @Column({
        type: 'timestamptz',
        nullable: true,
    })
    public endDate?: Date;

    /**
     * comment of CareerPath
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public comment?: string;

    /**
     * file of CareerPath
     */
    @ManyToOne(() => UploadEntity, null, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public file?: UploadEntity;

    /**
     * Employee of Career
     */
    @ManyToOne(() => Employee, (employee) => employee.careers, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * Is editable
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    public editable?: boolean;

    /**
     * The medical Visit
     */
    @ManyToOne(
        () => MedicalVisitEntity,
        (medicalVisit) => medicalVisit.careerPaths,
        {
            nullable: true,
            onDelete: 'SET NULL',
        },
    )
    public medicalVisit?: MedicalVisitEntity;

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
        return !!value.match(/^(title|comment|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of CareerPathEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): CareerPathEntity {
        return id ? new CareerPathEntity({ id: id }) : null;
    }
}
