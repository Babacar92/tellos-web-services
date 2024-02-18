import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";


@Entity({
    name: "contract_section"
})
export class ContractSectionEntity {

    /**
     * The constructor of Section Entity
     * @param data 
     */
    public constructor(data?: ContractSectionEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of ContractSectionEntity
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Title of section
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
     * Return an instance of ContractSectionEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): ContractSectionEntity {
        return id ? new ContractSectionEntity({ id: id }) : null;
    }

}