import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreatedByColumn } from "../../libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "../../libs/databases/decorators/columns/UpdatedByColumn";

@Entity({ name: 'business_market_type' })
export class BusinessMarketTypeEntity {

    public constructor(data?: BusinessMarketTypeEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * The id
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The title
     */
    @Column({
        nullable: true,
    })
    public title?: string;

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
        return !!value.match(/^(title|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of BusinessMarketTypeEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): BusinessMarketTypeEntity {
        return id ? new BusinessMarketTypeEntity({ id: id }) : null;
    }

}