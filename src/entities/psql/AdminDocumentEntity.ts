import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreatedByColumn } from "../../libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "../../libs/databases/decorators/columns/UpdatedByColumn";
import { UploadEntity } from "./UploadEntity";
import { DocumentCategoryEntity } from "./DocumentCategoryEntity";

@Entity({
    name: 'admin_document',
})
export class AdminDocumentEntity {

    public constructor(data?: AdminDocumentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Customer
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The file
     */
    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public file?: UploadEntity;

    /**
     * The category
     */
    @ManyToOne(() => DocumentCategoryEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public category?: DocumentCategoryEntity;

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
        return !!value.match(/^(code|title|createdBy|updatedBy)$/i);
    }

    public static init(id?: number): AdminDocumentEntity {
        return id ? new AdminDocumentEntity({ id: id }) : null;
    }

}