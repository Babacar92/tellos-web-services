//import { EquipmentFunding } from '@/entities/psql/equipment-funding.entity';
import { StockPile } from '@/entities/psql/stock-pile.entity';
import { ResultPaginationInterface } from '@/libs/databases/dto/interfaces/result.pagination.interface';

export interface StockPilePaginationResultInterface {
    /**
     * List of equipment funding
     */
    result: StockPile[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;
}
