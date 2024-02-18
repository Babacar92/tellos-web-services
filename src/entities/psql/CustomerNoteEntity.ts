import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "./CustomerEntity";
import { LoginEntity } from "./LoginEntity";
import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { UploadEntity } from "./UploadEntity";

@Entity({ name: 'customer_note' })
export class CustomerNoteEntity {

    public constructor(data?: CustomerNoteEntity) {
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
    @ManyToOne(() => CustomerEntity, customer => customer.notes, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public customer?: CustomerEntity;

    /**
     * Login of note
     */
    @ManyToOne(() => LoginEntity, login => login.customerNotes, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public login?: LoginEntity;

    /**
     * Documents of note
     */
    @ManyToMany(() => UploadEntity, {
        onDelete: 'CASCADE',
    })
    @JoinTable()
    public documents?: UploadEntity[];

    /**
     * Comment of note
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    public comment?: string;

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
        return !!value.match(/^(comment|createdBy|updatedBy)$/i);
    }

    public static init(id?: number): CustomerNoteEntity {
        return id ? new CustomerNoteEntity({ id: id }) : null;
    }

}