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
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { EntityEntity } from './EntityEntity';
import { Employee } from './EmployeeEntity';
import { UploadEntity } from './UploadEntity';
import { AvailableEnum } from 'src/modules/equipment/dto/enums/equipment.available.enum';
import { TypeEnum } from 'src/modules/equipment/dto/enums/equipment.type.enum';
import { CategoryEquipment } from './CategoryEquipmentEntity';

@Entity({
    name: 'equipment',
})
export class EquipmentEntity {
    /**
     * The constructor of Equipment
     * @param data
     */
    public constructor(data?: EquipmentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Equipment
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * libelle of Equipment
     */
    @Column({
        nullable: true,
    })
    public denomination?: string;

    /**
     * code of Equipment
     */
    @Column({
        nullable: true,
    })
    public code?: string;

    /**
     * Registraton number of Equipment
     */
    @Column({
        nullable: true,
    })
    public registrationNumber?: string;

    /**
     * order number of Equipment
     */
    @Column({
        nullable: true,
    })
    public orderNumber?: string;

    /**
     * Categorie of Equipment
     */
    @ManyToOne(() => CategoryEquipment, (entity) => entity.equipmentParks, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public categorie?: CategoryEquipment;

    /**
     * Type of Equipment
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: TypeEnum,
    })
    public type?: TypeEnum;

    /**
     * Entity of Equipment
     */
    @ManyToOne(() => EntityEntity, (entity) => entity.equipmentParks, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public entity?: EntityEntity;

    /**
     * Available of Equipment
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: AvailableEnum,
    })
    public available?: AvailableEnum;

    /**
     * Employee of Equipment
     */
    @ManyToOne(() => Employee, (employee) => employee.materialParks, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * Start Date
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public startDate?: Date;

    /**
     * End Date
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public endDate?: Date;

    /**
     * Order Date
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public orderDate?: Date;

    /**
     * Delivery Date
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public deliveryDate?: Date;

    /**
     * First circulation Date
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public firstCirculation?: Date;

    /**
     * Registration Date
     */
    @Column({
        nullable: true,
        type: 'date',
    })
    public registrationDate?: Date;

    /**
     * Original value
     */
    @Column({
        nullable: true,
        type: 'numeric',
    })
    public originalValue?: number;

    /**
     * Counter Standard cost
     */
    @Column({
        nullable: true,
        type: 'numeric',
    })
    public counter?: number;

    /**
     * Standard Cost of Equipment
     */
    @Column({
        nullable: true,
        type: 'numeric',
    })
    public standardCost?: number;

    /**
     * CO2 emissions of Equipment
     */
    @Column({
        nullable: true,
        type: 'numeric',
    })
    public co2Emissions?: number;

    /**
     * photo of Equipment
     */
    @ManyToOne(() => UploadEntity, null, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public photo?: UploadEntity;

    @Column({
        nullable: true,
    })
    public uniqueIdentifier?: string;

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
        return !!value.match(
            /^(code|denomination|registrationNumber|orderNumber|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Return an instance of EquipmentEntity. if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EquipmentEntity {
        return id ? new EquipmentEntity({ id: id }) : null;
    }
}
