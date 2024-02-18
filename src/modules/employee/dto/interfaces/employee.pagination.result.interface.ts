import { Employee } from 'src/entities/psql/EmployeeEntity';
import { ResultPaginationInterface } from '../../../../libs/databases/dto/interfaces/result.pagination.interface';

export interface EmployeePaginationResultInterface {
    /**
     * List of Quick Access
     */
    result: Employee[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;
}
