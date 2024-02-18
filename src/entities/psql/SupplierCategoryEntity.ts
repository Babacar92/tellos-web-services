import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';

@Entity({
    name: 'supplier_category',
})
@Unique(['name', 'deletedAt'])
export class SupplierCategoryEntity {
    /**
     * The constructor of supplier category
     * @param data
     */
    public constructor(data?: SupplierCategoryEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of supplier category
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The name of supplier category
     */
    @Column({
        nullable: false,
    })
    public name?: string;

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
        return !!value.match(/^(code|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of SupplierCategoryEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): SupplierCategoryEntity {
        return id ? new SupplierCategoryEntity({ id: id }) : null;
    }
}
