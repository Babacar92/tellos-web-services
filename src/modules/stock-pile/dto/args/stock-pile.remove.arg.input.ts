import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
//import { EquipmentFunding } from '@/entities/psql/equipment-funding.entity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { StockPileExistConstraint } from '../../constraints/stock-pile.exist.constraint';
import { StockPile } from '@/entities/psql/stock-pile.entity';

/**
 * Input for to create a new Quick Access
 */
export class StockPileRemoveArgInput {
    /**
     * Id of upload file
     */
    @Validate(StockPileExistConstraint, {})
    @Transform(({ value }) => StockPile.init(value))
    public id?: number | StockPile;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
