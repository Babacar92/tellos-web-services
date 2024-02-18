import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { EquipmentDocumentEntity } from "src/entities/psql/EquipmentDocumentEntity";

export interface EquipmentDocumentPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: EquipmentDocumentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}