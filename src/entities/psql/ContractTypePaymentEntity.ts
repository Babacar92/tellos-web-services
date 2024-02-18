import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";


@Entity({
    name: "contract_type_payment"
})
export class ContractTypePaymentEntity {

    /**
     * The constructor of ContractTypePaymentEntity
     * @param data 
     */
    public constructor(data?: ContractTypePaymentEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of ContractTypePaymentEntity
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Title of ContractTypePaymentEntity
     */
    @Column()
    public title?: string;

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
        return !!value.match(/^(title|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of ContractTypePaymentEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): ContractTypePaymentEntity {
        return id ? new ContractTypePaymentEntity({ id: id }) : null;
    }


}