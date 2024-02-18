import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UpperSnackCaseColumn } from "../../libs/databases/decorators/columns/UpperSnackCaseColumn";
import { ROLES_TYPES } from "../../types/roles.const";
import { PermissionEntity } from "./PermissionEntity";

/**
 * The Role Entity
 */
@Entity({ name: 'role' })
@Unique([
    'name',
    'deletedAt',
])
export class RoleEntity {

    /**
     * The constructor of Role Entity
     * @param data 
     */
    public constructor(data?: RoleEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Role
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Label of Role
     */
    @Column({
        nullable: true,
    })
    public label?: string;

    /**
     * Name of Role
     */
    @UpperSnackCaseColumn({
    })
    public name?: ROLES_TYPES;

    /**
     * Is enable
     */
    @Column({
        type: 'boolean',
        default: true,
    })
    public active?: boolean;

    /**
     * Permissions of Roles
     */
    @ManyToMany(() => PermissionEntity, {
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'role_permission'
    })
    public permissions?: PermissionEntity[];

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
     * Return an instance of RoleEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): RoleEntity {
        return id ? new RoleEntity({ id: id }) : null;
    }

}