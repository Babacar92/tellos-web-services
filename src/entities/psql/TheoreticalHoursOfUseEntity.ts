import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UpdatedByColumn } from "../../libs/databases/decorators/columns/UpdatedByColumn";
import { CreatedByColumn } from "../../libs/databases/decorators/columns/CreatedByColumn";
import { AdministrativeMaterialEntity } from "./AdministrativeMaterialEntity";

@Entity({ name: 'theoretical_hours_of_use_entity' })
export class TheoreticalHoursOfUseEntity {


    public constructor(data?: TheoreticalHoursOfUseEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * The id
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * year of the theoretical number of hours
     */
    @Column({
        nullable: true,
    })
    public year?: string;

    /**
     * Number of hours
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public hoursNumber?: number;

    /**
    * List of administrative material of theoretical hours
    */
    @OneToMany(() => AdministrativeMaterialEntity, adminMat => adminMat.theoreticalHour, {

    })
    public administrativeEquipment?: AdministrativeMaterialEntity[];

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
    public static isColumnString(value?: string): boolean {
        return !!value?.match(/^(year|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of TheoreticalHoursOfUseEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): TheoreticalHoursOfUseEntity {
        return id ? new TheoreticalHoursOfUseEntity({ id: id }) : null;
    }

}