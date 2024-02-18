import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { SectionCodeEntity } from "./SectionCodeEntity";


@Entity({
    name:"purchase_account"
})
export class PurchaseAccountEntity {

    /**
     * The constructor of PurchaseAccountEntity
     * @param data 
     */
    public constructor(data?: PurchaseAccountEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of PurchaseAccountEntity
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * account of purchasse account 
     */
    @Column()
    public account?: string;

    /**
     * Section code id
     */
    @ManyToOne(() => SectionCodeEntity, sectionCode => sectionCode.purchaseAccounts, {
            nullable: true,
            onDelete: 'SET NULL'
    })
    @JoinColumn()
    public sectionCode?: SectionCodeEntity;

    /**
     * Active mode of purchase account
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
        return !!value.match(/^(account|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of PurchaseAccountEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): PurchaseAccountEntity {
        return id ? new PurchaseAccountEntity({ id: id }) : null;
    }


}