import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UpdatedByColumn } from "../../libs/databases/decorators/columns/UpdatedByColumn";
import { CreatedByColumn } from "../../libs/databases/decorators/columns/CreatedByColumn";
import { LoginEntity } from "./LoginEntity";
import { UploadEntity } from "./UploadEntity";
import { CustomerEntity } from "./CustomerEntity";

@Entity({ name: 'customer_document' })
export class CustomerDocumentEntity {

    public constructor(data?: CustomerDocumentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Note
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Customer of note
     */
    @ManyToOne(() => CustomerEntity, customer => customer.documents, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public customer?: CustomerEntity;

    /**
     * Login of note
     */
    @ManyToOne(() => LoginEntity, login => login.customerDocuments, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public login?: LoginEntity;

    /**
     * Login of note
     */
    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public file?: UploadEntity;

    /**
     * Title
     */
    @Column({
        nullable: true,
    })
    public title?: string;

    /**
     * Description
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    public description?: string;

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
        return !!value.match(/^(title|description|createdBy|updatedBy)$/i);
    }

    public static init(id?: number): CustomerDocumentEntity {
        return id ? new CustomerDocumentEntity({ id: id }) : null;
    }

}