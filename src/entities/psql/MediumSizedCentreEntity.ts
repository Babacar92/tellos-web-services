import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
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
import { CategoryEquipment } from './CategoryEquipmentEntity';

@Entity({ name: 'medium_size_centre' })
@Unique(['code'])
export class MediumSizedCentreEntity {
    /**
     * The constructor of MediumSizedCentre Entity
     * @param data
     */
    public constructor(data?: MediumSizedCentreEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * The id of MediumSizedCentre
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * code of MediumSizedCentre
     */
    @Column({
        nullable: true,
    })
    public code?: string;

    /**
     * label of MediumSizedCentre
     */
    @Column({
        nullable: true,
    })
    public label?: string;

    /**
     * The categoryEquipments
     */
    @OneToMany(
        () => CategoryEquipment,
        (categoryEquipment) => categoryEquipment.mediumSizedCentre,
        {},
    )
    public categoryEquipments?: CategoryEquipment[];

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
        return !!value.match(/^(code|label|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of MediumSizedCentreEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): MediumSizedCentreEntity {
        return id ? new MediumSizedCentreEntity({ id: id }) : null;
    }
}
