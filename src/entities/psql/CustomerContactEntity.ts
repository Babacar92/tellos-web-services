import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { CryptColumn } from "src/libs/databases/decorators/columns/CryptColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "./CustomerEntity";
import { UploadEntity } from "./UploadEntity";

@Entity({ name: 'customer_contact' })
export class CustomerContactEntity {

    public constructor(data?: CustomerContactEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of contact
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Picture of customer
     */
    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public picture?: UploadEntity;

    /**
     * Customer of contact
     */
    @ManyToOne(() => CustomerEntity, customer => customer.contacts, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public customer?: CustomerEntity;

    /**
     * Lastname of contact
     */
    @CryptColumn({
        nullable: true,
    })
    public lastname?: string;

    /**
     * Firstname of contact
     */
    @CryptColumn({
        nullable: true,
    })
    public firstname?: string;

    /**
     * Company of contact
     */
    @CryptColumn({
        nullable: true,
    })
    public company?: string;

    /**
     * Department of contact
     */
    @CryptColumn({
        nullable: true,
    })
    public department?: string;

    /**
     * Position of contact
     */
    @CryptColumn({
        nullable: true,
    })
    public position?: string;

    /**
     * Email of contact
     */
    @CryptColumn({
        nullable: true,
    })
    public email?: string;

    /**
     * Phone of contact
     */
    @CryptColumn({
        nullable: true,
    })
    public phone?: string;

    /**
     * PhoneFix of contact
     */
    @CryptColumn({
        nullable: true,
    })
    public phoneFix?: string;

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
        return !!value.match(/^(createdBy|updatedBy)$/i);
    }

    /**
     * Check if is crypt column
     * @param name 
     * @returns 
     */
    public static isCryptColumn(name?: string): boolean {
        return !!name?.match(/^(lastname|firstname|company|department|position|email|phone|phoneFix)$/i);
    }

    public static init(id?: number): CustomerContactEntity {
        return id ? new CustomerContactEntity({ id: id }) : null;
    }

}