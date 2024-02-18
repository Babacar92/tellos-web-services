import { SupplierCategoryEntity } from '@/entities/psql/SupplierCategoryEntity';
import { ResultPaginationInterface } from '@Libs/databases/dto/interfaces/result.pagination.interface';

export interface SupplierCategoryPaginationResultInterface {
    /**
     * List of Quick Access
     */
    result: SupplierCategoryEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;
}
