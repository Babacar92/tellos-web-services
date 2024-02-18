import { Good } from 'src/entities/psql/good.entity';
import { ResultPaginationInterface } from '@Libs/databases/dto/interfaces/result.pagination.interface';

export interface GoodPaginationResultInterface {
    /**
     * List of Quick Access
     */
    result: Good[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;
}
