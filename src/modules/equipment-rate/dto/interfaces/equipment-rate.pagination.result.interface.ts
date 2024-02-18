import { EquipmentRateEntity } from "src/entities/psql/EquipmentRateEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EquipmentRatePaginationResultInterface {

    /**
     * List of equipment rate
     */
    result: EquipmentRateEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}