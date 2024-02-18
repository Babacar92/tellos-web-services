import { ResultPaginationInterface } from '../../../../libs/databases/dto/interfaces/result.pagination.interface';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';

export interface CategoryEquipmentPaginationResultInterface {
    /**
     * List of Quick Access
     */
    result: CategoryEquipment[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;
}
