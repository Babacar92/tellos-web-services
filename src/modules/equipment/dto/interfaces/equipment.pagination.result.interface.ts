import { EquipmentEntity } from "src/entities/psql/EquipmentEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EquipmentPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: EquipmentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}