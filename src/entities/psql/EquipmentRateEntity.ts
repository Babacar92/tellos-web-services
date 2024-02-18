import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { EntityEntity } from './EntityEntity';
import { WorkUnitEntity } from './WorkUnitEntity';
import { CategoryEquipment } from './CategoryEquipmentEntity';

@Entity({
    name: 'equipment_rate',
})
@Unique(['categoryEquipment', 'entity', 'deletedAt'])
export class EquipmentRateEntity {
    /**
     * The constructor of Equipment Rate
     * @param data
     */
    public constructor(data?: EquipmentRateEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Equipment Rate
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    @ManyToOne(() => EntityEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public entity?: EntityEntity;

    @ManyToOne(() => WorkUnitEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public workUnit?: WorkUnitEntity;

    @ManyToOne(() => CategoryEquipment, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public categoryEquipment?: CategoryEquipment;

    /**
     * the price
     */
    @Column({
        type: 'numeric',
        nullable: true,
        precision: 14,
        scale: 5,
    })
    public price?: number;

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
     * Return an instance of EquipmentRateEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EquipmentRateEntity {
        return id ? new EquipmentRateEntity({ id: id }) : null;
    }
}
