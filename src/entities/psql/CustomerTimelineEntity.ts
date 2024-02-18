import { AfterLoad, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreatedByColumn } from "../../libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "../../libs/databases/decorators/columns/UpdatedByColumn";
import { CustomerTimelineTypeEnum } from "../../modules/customer-timeline/dto/enum/customer-timeline.type.enum";
import { CustomerEntity } from "./CustomerEntity";
import { UploadEntity } from "./UploadEntity";
import { LoginEntity } from "./LoginEntity";

@Entity({ name: 'customer_timeline' })
export class CustomerTimelineEntity {

    public constructor(data?: CustomerTimelineEntity) {
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
    @ManyToOne(() => CustomerEntity, customer => customer.timelines, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public customer?: CustomerEntity;

    /**
     * Login of note
     */
    @ManyToOne(() => LoginEntity, login => login.customerTimelines, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public login?: LoginEntity;

    /**
     * Documents of note
     */
    @ManyToOne(() => UploadEntity, {
        onDelete: 'CASCADE',
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
     * Type
     */
    @Column({
        type: 'enum',
        enum: CustomerTimelineTypeEnum,
        nullable: true,
    })
    public type?: CustomerTimelineTypeEnum;

    /**
     * Comment
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    public comment?: string;

    /**
     * Date from
     */
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public dateFrom?: Date;

    /**
     * Date to
     */
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public dateTo?: Date;

    /**
     * Is timeline todo
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    public isTodo?: boolean;

    /**
     * Done at
     */
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public doneAt?: Date;

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
     * Is done boolean
     */
    public done?: boolean;

    @AfterLoad()
    public afterLoad?(): void {
        this.done = !!this.doneAt;
    }

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(comment|createdBy|updatedBy)$/i);
    }

    public static init(id?: number): CustomerTimelineEntity {
        return id ? new CustomerTimelineEntity({ id: id }) : null;
    }

}