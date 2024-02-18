import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';

@Entity({
    name: 'activity',
})
@Unique(['code', 'deletedAt'])
export class ActivityEntity {
    /**
     * The constructor of activity
     * @param data
     */
    public constructor(data?: ActivityEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of activity
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The name of activity
     */
    @Column({
        nullable: false,
    })
    public name?: string;

    /**
     * The code of activity
     */
    @Column({
        nullable: false,
    })
    public code?: string;

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
        return !!value.match(/^(name|code|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of ActivityEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): ActivityEntity {
        return id ? new ActivityEntity({ id: id }) : null;
    }
}
