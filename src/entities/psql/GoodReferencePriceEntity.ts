//NestJs
import { Field } from '@nestjs/graphql';

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
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { WorkUnitEntity } from './WorkUnitEntity';
import { EntityEntity } from './EntityEntity';
import { Good } from './good.entity';

//Entities
import { Supplier } from './supplier.entity';

@Entity({
    name: 'good_reference_price',
})
export class GoodReferencePriceEntity {
    /**
     * The constructor of good reference price
     * @param data
     */
    public constructor(data?: GoodReferencePriceEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of good reference price
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The start date of the application of price
     */
    @Column({
        type: 'date',
    })
    public startDate?: Date;

    /**
     * The end date of the application of price
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public endDate?: Date;

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
     * The discount price
     */
    @Column({
        type: 'numeric',
        nullable: true,
        precision: 14,
        scale: 2,
    })
    public discount?: number;

    /**
     * The price after execution of discount
     */
    @Column({
        type: 'numeric',
        nullable: true,
        precision: 14,
        scale: 5,
    })
    public netPrice?: number;

    /**
     * Minimum qty commanded
     */
    @Column({
        type: 'integer',
        nullable: true,
    })
    public qtyMin?: number;

    /**
     * Is the price negociate in an executive contract for the Tellos GROUP
     */
    @Column({
        type: 'boolean',
        nullable: true,
    })
    public executiveContract?: boolean;

    /**
     * The work unit of the good
     */
    @ManyToOne(() => WorkUnitEntity, {})
    @JoinColumn()
    public workUnit?: WorkUnitEntity;

    /**
     * The entities to which the price is applied
     */
    @ManyToMany(() => EntityEntity, {
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'good_reference_price_entity',
    })
    public entities?: EntityEntity[];

    /**
     * The good to which the price is applied
     */
    @ManyToOne(() => Good, {})
    @JoinColumn()
    public good?: Good;

    // Add the link to supplier
    @ManyToOne(() => Supplier, {})
    @JoinColumn({ name: 'supplier_id' })
    supplier?: Supplier;

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
        return !!value.match(/^(createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of GoodReferencePriceEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): GoodReferencePriceEntity {
        return id ? new GoodReferencePriceEntity({ id: id }) : null;
    }
}
