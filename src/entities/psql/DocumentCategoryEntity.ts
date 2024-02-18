import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { DocumentTypeEntity } from "./DocumentTypeEntity";

@Entity({ name: 'document_category' })
@Unique([
    'title',
    'deletedAt',
])
export class DocumentCategoryEntity {

    /**
     * The constructor of Entity Entity
     * @param data 
     */
    public constructor(data?: DocumentCategoryEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of document
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Title of Document Tag
     */
    @Column({
        nullable: true,
    })
    public title?: string;

    /**
     * The icon of Document Tag
     */
    @Column({
        nullable: true,
    })
    public icon?: string;

    /**
     * Types of Document Type
     */
    @OneToMany(() => DocumentTypeEntity, doc => doc.category)
    public types?: DocumentTypeEntity[];

    /**
     * Active mode of Document Tag
     */
    @Column({
        type: 'boolean',
        default: false,
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
        return !!value.match(/^(title|icon|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of DocumentCategoryEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): DocumentCategoryEntity {
        return id ? new DocumentCategoryEntity({ id: id }) : null;
    }

}