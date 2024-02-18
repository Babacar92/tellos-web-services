import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";


@Entity({
    name: "contract_type_entry"
})
export class ContractTypeEntryEntity {

    /**
     * The constructor of Contract Type Entry
     * @param data 
     */
    public constructor(data?: ContractTypeEntryEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of ContractTypeEntryEntity
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Title of type of entry
     */
    @Column()
    public title?: string;

    /**
     * Active mode of department
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
     * Return an instance of ContractTypeEntryEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): ContractTypeEntryEntity {
        return id ? new ContractTypeEntryEntity({ id: id }) : null;
    }


}