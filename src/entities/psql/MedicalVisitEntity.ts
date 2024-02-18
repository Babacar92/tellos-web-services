import { ContractEnum } from 'src/modules/employee/dto/enums/employee.contract.enum';
import {
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
import { DepartmentEntity } from './DepartmentEntity';
import { Employee } from './EmployeeEntity';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { UploadEntity } from './UploadEntity';
import { CareerPathEntity } from './CareerPathEntity';
import { MEDICAL_VISIT_STATUT } from 'src/modules/medical-visit/dto/enums/medical-visit.enum';
import { EntityEntity } from './EntityEntity';

@Entity({
    name: 'medical_visists',
})
export class MedicalVisitEntity {
    /**
     * The constructor of Medical Visits Entity
     * @param data
     */
    public constructor(data?: MedicalVisitEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of MedicalVisits
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Entity of Job description
     */
    @ManyToOne(() => EntityEntity, (entity) => entity.medicalVisits, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public entity?: EntityEntity;

    /**
     * Departement of Employee who granted Medical Visit
     */
    @ManyToOne(() => DepartmentEntity, (service) => service.medicalVisits, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public service?: DepartmentEntity;

    /**
     * Contract of Employee who granted Medical Visit
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: ContractEnum,
    })
    public contract?: ContractEnum;

    /**
     * Doctor opinion Statut Medical visit
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: MEDICAL_VISIT_STATUT,
    })
    public statut?: MEDICAL_VISIT_STATUT;

    /**
     * start date Medical Visit
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public startDate?: Date;

    /**
     * endate Medical Visit
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public endDate?: Date;

    /**
     * employee
     */
    @ManyToOne(() => Employee, (employee) => employee.medicalVisits, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * last Date Medical Visits
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public lastDateMedicalVisit?: Date;

    /**
     * next Date Medical Visits
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public nextDateMedicalVisit?: Date;

    /**
     * placeOfTheMedicalvisit
     */
    @Column({
        nullable: true,
    })
    public placeOfTheMedicalvisit?: string;

    /**
     * placeOfTheMedicalvisit
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public contraindication?: string;

    /**
     * Supporting document
     */
    @ManyToOne(() => UploadEntity, null, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public file?: UploadEntity;

    /**
     * The careerPaths
     */
    @OneToMany(
        () => CareerPathEntity,
        (careerPath) => careerPath.medicalVisit,
        {},
    )
    public careerPaths?: CareerPathEntity[];

    /**
     * Active mode of Medical Visits
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
            /^(placeOfTheMedicalvisit|contraindication|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Return an instance of MedicalVisitsEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): MedicalVisitEntity {
        return id ? new MedicalVisitEntity({ id: id }) : null;
    }
}
