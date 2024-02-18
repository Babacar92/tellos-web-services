import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
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
import { EntityEntity } from './EntityEntity';
import { Employee } from './EmployeeEntity';
import { FinancingEnum } from 'src/modules/administrative-material/dto/enums/administrative-material-financing.enum';
import { ExitTypeEnum } from 'src/modules/administrative-material/dto/enums/administrative-material-exit-type.enum';
import { TypeOfSaleEnum } from 'src/modules/administrative-material/dto/enums/administrative-material-type-of-sale.enum';
import { TheoreticalHoursOfUseEntity } from './TheoreticalHoursOfUseEntity';

@Entity({ name: 'administrative_material' })
export class AdministrativeMaterialEntity {
    /**
     * The constructor of administrative Entity
     * @param data
     */
    public constructor(data?: AdministrativeMaterialEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * The id of administrative material
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Monthly rent of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public monthlyRent?: number;

    /**
     * Maintenance rent of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public maintenanceRent?: number;

    /**
     * Max. authorized KM of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public maxAuthorizedKm?: number;

    /**
     * Buy-back value of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public BuybackValue?: number;

    /**
     * Fixed asset code of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public fixedAssetCode?: number;

    /**
     * Sale price of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public salePrice?: number;

    /**
     * Geolocatization box N°of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public geolocatizationBoxNumber?: number;

    /**
     * Monthly unit price of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public monthlyUnitPrice?: number;

    /**
     * TSVR purchase of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public TSVRPurchase?: number;

    /**
     * TSVR transfer of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public TSVRTransfer?: number;

    /**
     * TSVR transfer of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public totalCard?: number;

    /**
     * TSVR transfer of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public PASSango?: number;

    /**
     * Break-even point of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public breakevenPoint?: number;

    /**
     * Utilization rate of administrative material
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
    })
    public utilizationRate?: number;

    /**
     * Comment
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    public comment?: string;

    /**
     * Financing of admin material
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: FinancingEnum,
    })
    public financing?: FinancingEnum;

    /**
     * Exit type of admin material
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: ExitTypeEnum,
    })
    public exitType?: ExitTypeEnum;

    /**
     * type of sale of admin material
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: TypeOfSaleEnum,
    })
    public typeOfSale?: TypeOfSaleEnum;

    /**
     * Pending exit
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    public pendingExit?: boolean;

    /**
     * Machinery insurance
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    public carFleetInsurance?: boolean;

    /**
     * Machinery insurance
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    public machineryInsurance?: boolean;

    /**
     * Contract start date
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public contractStartDate?: Date;

    /**
     * Contract end date
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public contractEndDate?: Date;

    /**
     * Transfer / sale date
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public saleDate?: Date;

    /**
     * Entity of admin material
     */
    @ManyToOne(() => EntityEntity, (entity) => entity.administrativeEquipment, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public companyOwner?: EntityEntity;

    /**
     * Entity of theoretical hours
     */
    @ManyToOne(
        () => TheoreticalHoursOfUseEntity,
        (theo) => theo.administrativeEquipment,
        {
            onDelete: 'SET NULL',
            nullable: true,
        },
    )
    @JoinColumn()
    public theoreticalHour?: TheoreticalHoursOfUseEntity;

    /**
     * List of Customer name
     */
    @OneToMany(() => Employee, (customer) => customer.adminMaterialCustomer, {})
    public customerNames?: Employee[];

    /**
     * List Persons to notify
     */
    @OneToMany(
        () => Employee,
        (customer) => customer.adminMaterialPersonToNotify,
        {},
    )
    public personsToNotify?: Employee[];

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
     * Check if column comment is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(comment|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of AdministrativeMaterialEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): AdministrativeMaterialEntity {
        return id ? new AdministrativeMaterialEntity({ id: id }) : null;
    }
}
