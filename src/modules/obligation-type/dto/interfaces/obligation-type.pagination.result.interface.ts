import { ObligationType } from '@/entities/psql/obligation-type.entity';
import { ResultPaginationInterface } from '@/libs/databases/dto/interfaces/result.pagination.interface';

export interface ObligationTypePaginationResultInterface {
    /**
     * List of equipment funding
     */
    result: ObligationType[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;
}
