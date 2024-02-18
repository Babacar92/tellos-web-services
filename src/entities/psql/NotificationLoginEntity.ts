import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LoginEntity } from "./LoginEntity";
import { NotificationEntity } from "./NotificationEntity";
import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";

@Entity({ name: 'notification_login' })
export class NotificationLoginEntity {

    /**
     * The constructor of NotificationLoginEntity
     * @param data 
     */
    public constructor(data?: NotificationLoginEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of notification
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * Employee login of link table
     */
    @ManyToOne(() => LoginEntity, login => login.notifications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    public login?: LoginEntity;

    /**
     * Notification of link table
     */
    @OneToOne(() => NotificationEntity, notification => notification.info, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    public notification?: NotificationEntity;

    /**
     * Is read of link table
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    public isRead?: boolean;

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
     * Return an instance of NotificationLoginEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): NotificationLoginEntity {
        return id ? new NotificationLoginEntity({ id: id }) : null;
    }

}