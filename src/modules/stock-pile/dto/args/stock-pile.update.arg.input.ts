import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { StockPileNotExistByColumnConstraint } from '../../constraints/stock-pile.not.exist.by.column.constraints';
import { StockPileExistConstraint } from '../../constraints/stock-pile.exist.constraint';
import { Field, InputType, Int } from '@nestjs/graphql';
import { EntityExistConstraint } from '@/modules/entity/constraints/entity.exist.constraint';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { Transform } from 'class-transformer';

/**
 * Input for to update a new stock pile
 */
@InputType()
export class StockPileUpdateArgInput {
  /**
   * The id of stock pile
   */
  @IsNotEmpty()
  @Field()
  @Validate(StockPileExistConstraint, {})
  public id: number;


  /**
   * The title of stock pile
   */
  @IsOptional()
  @Field()
  @IsString()
  @Validate(StockPileNotExistByColumnConstraint, {})
  public name?: string;

  @IsOptional()
  @Field((type) => Int)
  @Validate(EntityExistConstraint, {})
  @Transform(({ value }) => EntityEntity.init(value))
  entity?: EntityEntity;

}
