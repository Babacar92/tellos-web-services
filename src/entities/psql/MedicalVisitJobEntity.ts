import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ContractEntity } from "./ContractEntity";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";


@Entity({
    name: "medical_visit_job"
})
export class MedicalVisitJobEntity {

    /**
     * The constructor of Contract MedicalVisitJob
     * @param data 
     */
    public constructor(data?: MedicalVisitJobEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of MedicalVisitJob
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Title of MedicalVisitJob
     */
    @Column()
    public title?: string;

    /**
     * Active 
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
        return !!value.match(/^(title|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of MedicalVisitJobEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): MedicalVisitJobEntity {
        return id ? new MedicalVisitJobEntity({ id: id }) : null;
    }


}