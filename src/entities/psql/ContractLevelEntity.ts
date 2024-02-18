import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";


@Entity({
    name: "contract_level"
})
export class ContractLevelEntity {

    /**
     * The constructor of level Entity
     * @param data 
     */
    public constructor(data?: ContractLevelEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of ContractLevelEntity
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Title  of level
     */
    @Column()
    public title?: string;

    /**
     * Active mode of department
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
        return !!value.match(/^(title|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of ContractLevelEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): ContractLevelEntity {
        return id ? new ContractLevelEntity({ id: id }) : null;
    }

}