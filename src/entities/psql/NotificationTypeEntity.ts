import { CreatedByColumn } from "src/libs/databases/decorators/columns/CreatedByColumn";
import { UpdatedByColumn } from "src/libs/databases/decorators/columns/UpdatedByColumn";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { NotificationEntity } from "./NotificationEntity";

@Entity({ name: 'notification_type' })
@Unique([
    'title',
    'deletedAt',
])
export class NotificationTypeEntity {

    /**
     * The constructor of Career Path Entity
     * @param data 
     */
    public constructor(data?: NotificationTypeEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of notification type
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * All notifications
     */
    @OneToMany(() => NotificationEntity, notification => notification.type, {
        onDelete: 'SET NULL',
    })
    public notifications?: NotificationEntity[];

    /**
     * Title of Notification type
     */
    @Column({
        nullable: true,
    })
    public title?: string;

    /**
     * Icon of Notification type
     */
    @Column({
        nullable: true,
    })
    public icon?: string;

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
     * Total notification
     */
    public total?: number;

    /**
     * Check if column name is string
    */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(title|icon|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of NotificationTypeEntity if id is a number
     * @param id 
     * @returns 
     */
    public static init(id?: number): NotificationTypeEntity {
        return id ? new NotificationTypeEntity({ id: id }) : null;
    }

}