import { EquipmentFunding } from '@/entities/psql/equipment-funding.entity';
import { ResultPaginationInterface } from '@/libs/databases/dto/interfaces/result.pagination.interface';

export interface EquipmentFundingPaginationResultInterface {
    /**
     * List of equipment funding
     */
    result: EquipmentFunding[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;
}
