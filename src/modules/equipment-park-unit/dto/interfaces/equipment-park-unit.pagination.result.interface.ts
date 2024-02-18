import { EquipmentParkUnitEntity } from "src/entities/psql/EquipmentParkUnitEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EquipmentParkUnitPaginationResultInterface {

    /**
     * List of Work Unit
     */
    result: EquipmentParkUnitEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}