import { EquipmentTheoricalHour } from "src/entities/psql/equipment-theorical-hour.entity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EquipmentTheoricalHourPaginationResultInterface {

    /**
     * List of equipment theorical hour
     */
    result: EquipmentTheoricalHour[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}