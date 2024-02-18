import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('equipment_theorical_hour')
export class EquipmentTheoricalHour extends BaseEntity {
    constructor(data?: Partial<EquipmentTheoricalHour>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @Column()
    @Field((type) => Float)
    value!: number;

    /**
     * Check if column is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of EquipmentTheoricalHour if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EquipmentTheoricalHour {
        return id ? new EquipmentTheoricalHour({ id: id }) : null;
    }
}
