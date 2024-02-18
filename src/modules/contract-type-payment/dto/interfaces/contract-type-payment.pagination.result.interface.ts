import { ContractTypePaymentEntity } from "src/entities/psql/ContractTypePaymentEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface ContractTypePaymentPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: ContractTypePaymentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}