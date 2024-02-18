import { IsString, Validate } from 'class-validator';
import { StockPileNotExistByColumnConstraint } from '../../constraints/stock-pile.not.exist.by.column.constraints';
import { Field, InputType, Int } from '@nestjs/graphql';
import { EntityExistConstraint } from '@/modules/entity/constraints/entity.exist.constraint';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { Transform } from 'class-transformer';

/**
 * Input for to create a new stock pile
 */
@InputType()
export class StockPileCreateArgInput {
    /**
     * The name of stock pile
     */
    @IsString()
    @Field()
    @Validate(StockPileNotExistByColumnConstraint, {})
    public name: string;

    @Field((type) => Int)
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    entity: EntityEntity;

}
