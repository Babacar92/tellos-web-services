import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { CreatedByColumn } from "../../libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "../../libs/databases/decorators/columns/UpdatedByColumn";
import { CustomerEntity } from "./CustomerEntity";

@Unique([
    'code',
    'deletedAt',
])
@Unique([
    'title',
    'deletedAt',
])
@Entity({ name: "regulation_code" })
export class RegulationCodeEntity {

    public constructor(data?: RegulationCodeEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Customer
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The customers
     */
    @OneToMany(() => CustomerEntity, customer => customer.regulationCode, {
        onDelete: 'SET NULL',
    })
    public customers?: CustomerEntity[];

    /**
     * The code
     */
    @Column({
        nullable: true,
    })
    public code?: string;

    /**
     * The title
     */
    @Column({
        nullable: true,
    })
    public title?: string;

    /**
     * The immediateDays
     */
    @Column({
        type: 'integer',
        nullable: true,
    })
    public immediateDays?: number;

    /**
     * The specificity
    */
    @Column({
        type: 'boolean',
        nullable: true,
    })
    public specificity?: boolean;

    /**
     * The paymentDays
     */
    @Column({
        type: 'integer',
        nullable: true,
    })
    public paymentDays?: number;

    /**
     * The additionnalDays
     */
    @Column({
        type: 'integer',
        nullable: true,
    })
    public additionnalDays?: number;

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

    public static init(id?: number): RegulationCodeEntity {
        return id ? new RegulationCodeEntity({ id: id }) : null;
    }

}