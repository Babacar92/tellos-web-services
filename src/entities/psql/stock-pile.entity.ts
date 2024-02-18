//NestJs
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import { Column, Entity, PrimaryGeneratedColumn ,ManyToOne,JoinColumn} from 'typeorm';
import { EntityEntity } from './EntityEntity';

//Schemas
import { BaseEntity } from 'src/common/entities/base.entity';

@ObjectType()
@Entity('stock_pile')
export class StockPile extends BaseEntity {
    constructor(data?: Partial<StockPile>) {
        super();
        if (data) Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @Column({unique: true})
    @Field()
    code!: string;


    @Column()
    @Field()
    name!: string;


    @ManyToOne(() => EntityEntity, (entity) => entity.stockpiles)
    @JoinColumn({ name: 'entity_id' })
    @Field((type) => EntityEntity)
    entity!: EntityEntity;

    @Column()
    entity_id: number;

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(name|code|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of WorkUnitEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): StockPile {
        return id ? new StockPile({ id: id }) : null;
    }
}
