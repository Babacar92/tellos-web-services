//NestJs
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//Schemas
import { BaseEntity } from 'src/common/entities/base.entity';

@ObjectType()
@Entity('equipment_funding')
export class EquipmentFunding extends BaseEntity {
    constructor(data?: Partial<EquipmentFunding>) {
        super();
        if (data) Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @Column()
    @Field()
    name!: string;

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(name|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of WorkUnitEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EquipmentFunding {
        return id ? new EquipmentFunding({ id: id }) : null;
    }
}
