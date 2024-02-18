import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { PERMISSIONS_NAMES, PERMISSIONS_TYPES } from "../../types/permissions.const";

/**
 * The Permission Entity
 */
@Entity({ name: 'permission' })
@Unique([
    'name',
    'deletedAt',
])
export class PermissionEntity {

    /**
     * The constructor of Permission Entity
     * @param data 
     */
    public constructor(data?: PermissionEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Permission
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Name of Role
     */
    @Column({
        type: 'enum',
        enum: PERMISSIONS_NAMES,
    })
    public name?: PERMISSIONS_TYPES;

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
        return !!value.match(/^(name|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of PermissionEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): PermissionEntity {
        return id ? new PermissionEntity({ id: id }) : null;
    }

}