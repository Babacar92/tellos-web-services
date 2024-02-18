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
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { MediumSizedCentreEntity } from './MediumSizedCentreEntity';
import { EquipmentRateEntity } from './EquipmentRateEntity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EquipmentPark } from './equipment-park.entity';

@ObjectType()
@Entity({
    name: 'category_equipment',
})
export class CategoryEquipment {
    /**
     * The constructor of Category Equipment
     * @param data
     */
    public constructor(data?: CategoryEquipment) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Category Equipment
     */
    @PrimaryGeneratedColumn()
    @Field((type) => Int, { nullable: true })
    public id?: number;

    /**
     * Code of Category Equipment
     */
    @Column()
    @Field({ nullable: true })
    public code?: string;

    /**
     * Title
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public title?: string;

    /**
     * cost price
     */
    // @Column({
    //   type: 'numeric',
    //   nullable: true,
    //   precision: 20,
    //   scale: 2,
    // })
    // public costPrice?: number;

    /**
     * The work unite
     */
    // @ManyToOne(() => WorkUnitEntity, null, {
    //   onDelete: 'SET NULL',
    //   nullable: true,
    // })
    // @JoinColumn()
    // public workUnit?: WorkUnitEntity;

    /**
     * mediumSizedCentre
     */
    @ManyToOne(
        () => MediumSizedCentreEntity,
        (mediumSizedCentre) => mediumSizedCentre.categoryEquipments,
        {
            nullable: true,
            onDelete: 'SET NULL',
        },
    )
    @JoinColumn()
    @Field((type) => MediumSizedCentreEntity, { nullable: true })
    public mediumSizedCentre?: MediumSizedCentreEntity;

    @Column({ nullable: true })
    medium_sized_centre_id?: number;

    /**
     * List of material park of category equipment
     */
    @OneToMany(
        () => EquipmentPark,
        (equipmentPark) => equipmentPark.category,
        {},
    )
    @Field((type) => [EquipmentPark], { nullable: true })
    public equipmentParks?: EquipmentPark[];

    /**
     * List of equipment rates
     */
    @OneToMany(
        () => EquipmentRateEntity,
        (equipmentRate) => equipmentRate.categoryEquipment,
        {},
    )
    @Field((type) => [EquipmentRateEntity], { nullable: true })
    public equipmentRates?: EquipmentRateEntity[];

    /**
     * Active mode
     */
    @Column({
        type: 'boolean',
        default: true,
    })
    @Field({ nullable: true })
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
        return !!value.match(/^(code|title|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of CategoryEquipmentEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): CategoryEquipment {
        return id ? new CategoryEquipment({ id: id }) : null;
    }
}
