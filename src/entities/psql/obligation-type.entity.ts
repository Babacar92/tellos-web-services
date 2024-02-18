//NestJs
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//Schemas
import { BaseEntity } from 'src/common/entities/base.entity';

@ObjectType()
@Entity('obligation_type')
export class ObligationType extends BaseEntity {
    constructor(data?: Partial<ObligationType>) {
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
    public static init(id?: number): ObligationType {
        return id ? new ObligationType({ id: id }) : null;
    }
}
