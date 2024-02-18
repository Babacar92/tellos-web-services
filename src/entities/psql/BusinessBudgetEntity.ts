import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreatedByColumn } from "../../libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "../../libs/databases/decorators/columns/UpdatedByColumn";
import { EntityEntity } from "./EntityEntity";
import { BusinessEntity } from "./BusinessEntity";

@Entity({
    name: 'business_budget',
})
export class BusinessBudgetEntity {

    public constructor(data?: BusinessBudgetEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * The id
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Entity
     */
    @ManyToOne(() => EntityEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public entity?: EntityEntity;

    /**
     * Business
     */
    @ManyToOne(() => BusinessEntity, business => business.budges, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    public business?: BusinessEntity;

    /**
     * The work
     */
    @Column({
        nullable: true,
    })
    public work?: string;

    /**
     * The htPrice
     */
    @Column({
        type: 'numeric',
        nullable: true,
        precision: 20,
        scale: 2,
    })
    public htPrice?: number;

    /**
     * The margin
     */
    @Column({
        type: 'numeric',
        nullable: true,
        precision: 20,
        scale: 2,
    })
    public margin?: number;

    /**
     * The htMargin
     */
    @Column({
        type: 'numeric',
        nullable: true,
        precision: 20,
        scale: 2,
    })
    public htMargin?: number;

    /**
     * The htTotal
     */
    @Column({
        type: 'numeric',
        nullable: true,
        precision: 20,
        scale: 2,
    })
    public htTotal?: number;

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
        return !!value?.match(/^(label|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of BusinessBudgetEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): BusinessBudgetEntity {
        return id ? new BusinessBudgetEntity({ id: id }) : null;
    }

}