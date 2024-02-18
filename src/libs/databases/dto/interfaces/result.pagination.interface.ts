import { InputType } from '@nestjs/graphql';
import { PaginationArg } from '../args/pagination.arg';

/**
 * Result of pagination
 */
@InputType()
export class ResultPaginationInterface {
    /** Page index */
    page?: number;

    /** Total number of pages*/
    totalPage?: number;

    /** Total number of items */
    total?: number;

    /** If there is a next page*/
    hasNext?: boolean;

    /** If there is a previous page*/
    hasPrevious?: boolean;

    /** How many items per page */
    limit?: number;
}

export class PaginatedResult<T> {
    public result: T[];
    public pagination: ResultPaginationInterface;

    static getPaginationSkip(pagination: PaginationArg): number {
        if (!pagination.page || !pagination.limit) {
            return 0;
        }

        const page = pagination.page - 1;

        return page * pagination.limit;
    }

    static buildResult<T>(
        data: T[],
        count: number,
        paginationArg: PaginationArg,
    ): PaginatedResult<T> {
        const hasResult = data.length > 0;
        const pagination: ResultPaginationInterface = {
            page: hasResult ? paginationArg.page : 0,
            limit: hasResult ? paginationArg.limit : 0,
            total: count,
            hasPrevious: paginationArg.page > 1,
            totalPage: hasResult ? Math.ceil(count / paginationArg.limit) : 1, // To be check if default value is not 0
        };

        pagination.hasNext = pagination.totalPage > paginationArg.page;

        return {
            result: data,
            pagination,
        };
    }
}
