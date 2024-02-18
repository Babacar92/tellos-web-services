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
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({
    name: 'equipment_park_unit',
})
@Unique(['title', 'deletedAt'])
export class EquipmentParkUnitEntity {
    /**
     * The constructor of Category Equipment
     * @param data
     */
    public constructor(data?: EquipmentParkUnitEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Category Equipment
     */
    @PrimaryGeneratedColumn()
    @Field((type) => Int, { nullable: true })
    public id?: number;

    /**
     * The title
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public title?: string;

    /**
     * Active mode
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    @Field({ nullable: true })
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
     * Return an instance of EquipmentParkUnitEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EquipmentParkUnitEntity {
        return id ? new EquipmentParkUnitEntity({ id: id }) : null;
    }
}
