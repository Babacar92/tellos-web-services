import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { NOTIFICATION_CATEGORY_ENUM } from "src/modules/notification/dto/enum/notification.category.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NotificationTypeEntity } from "./NotificationTypeEntity";
import { NotificationLoginEntity } from "./NotificationLoginEntity";

@Entity({ name: 'notification' })
export class NotificationEntity {

    /**
     * The constructor of Career Path Entity
     * @param data 
     */
    public constructor(data?: NotificationEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of notification
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Type of notification
     */
    @ManyToOne(() => NotificationTypeEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public type?: NotificationTypeEntity;

    /**
     * Notification of login
     */
    @OneToOne(() => NotificationLoginEntity, info => info.notification, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    public info?: NotificationLoginEntity;

    /**
     * Catefory of notification
     */
    @Column({
        type: 'enum',
        enum: NOTIFICATION_CATEGORY_ENUM,
        nullable: true,
    })
    public category?: NOTIFICATION_CATEGORY_ENUM;

    /**
     * Data of notification
     */
    @Column({
        type: 'json',
        nullable: true,
    })
    public data?: any;

    /**
     * Is enable
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
        return !!value.match(/^(createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of NotificationEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): NotificationEntity {
        return id ? new NotificationEntity({ id: id }) : null;
    }

}