import {
    Brackets,
    EntityManager,
    ObjectLiteral,
    SelectQueryBuilder,
} from 'typeorm';
import { PaginationArg } from '../dto/args/pagination.arg';
import { ResultPaginationInterface } from '../dto/interfaces/result.pagination.interface';
import { gen, is_type } from '../../../utils/utils';
import { UserPayloadInterface } from '../../auth/dto/interfaces/user.payload.interface';
import { RequestContext } from 'nestjs-request-context';
import * as dotenv from 'dotenv';
import { DatabaseSortArg } from '../dto/args/database.sort.arg';

dotenv.config();

/**
 * Apply filter EQUAL OR NOT
 * @param qb
 * @param value
 * @param field
 * @param alias
 * @param isNotEqual
 */
export const applyEqualFilter = (
    qb: SelectQueryBuilder<any>,
    value: any,
    field: string,
    alias: string,
    isNotEqual?: boolean,
) => {
    if (value !== undefined && value !== null) {
        const data = {};
        data[field] = value;
        const operator = isNotEqual ? '!=' : '=';
        qb.andWhere(`${alias}.${field} ${operator} :${field}`, data);
    }
};

/**
 * Apply filter EQUAL OR NOT
 * @param qb
 * @param value
 * @param field
 * @param alias
 * @param isNotIn
 */
export const applyInFilter = (
    qb: SelectQueryBuilder<any>,
    value: any[],
    field: string,
    alias: string,
    isNotIn?: boolean,
) => {
    if (is_type(value, Array)) {
        const data = {};
        data[field] = value;
        const operator = isNotIn ? 'NOT IN' : 'IN';
        qb.andWhere(`${alias}.${field} ${operator} (:...${field})`, data);
    }
};

/**
 * Apply filter LIKE OR NOT
 * @param qb
 * @param alias
 * @param likeRequest
 * @param isNotLike
 */
export const applyLikeFilter = (
    qb: SelectQueryBuilder<any>,
    alias: string,
    likeRequest?: any,
    isNotLike?: boolean,
) => {
    // Add like/not like filter
    if (likeRequest) {
        const values = {};
        let queryString = '';
        for (const _key in likeRequest) {
            // Add OR
            if (queryString !== '') queryString += ' OR ';
            // Set query key
            const queryKey = gen(10, true, true, true, false);
            // Add request condition
            const operator = isNotLike ? 'NOT LIKE' : 'LIKE';
            queryString += `${alias}.${_key} ${operator} :${queryKey}`;
            // Add request condition value
            values[queryKey] = `%${likeRequest[_key]}%`;
        }
        qb.andWhere(`(${queryString})`, values);
    }
};

/**
 * Return pagination result
 * @param result
 * @param count
 * @param pagination
 * @returns
 */
export const buildPaginationResult = (
    result: any[],
    count: number,
    pagination: PaginationArg,
): { result: any[]; pagination: ResultPaginationInterface } => {
    if (result) {
        const hasResult = !!result.length;
        const response: {
            result: any[];
            pagination: ResultPaginationInterface;
        } = {
            result: result,
            pagination: {
                page: hasResult ? pagination.page : 0,
                limit: hasResult ? pagination.limit : 0,
                total: count,
                hasPrevious: pagination.page > 1,
            },
        };

        // Set total page
        let totalPage: number;
        if (hasResult) {
            totalPage = pagination.limit ? count / pagination.limit : 1;
            if (totalPage.toString().match(/(\.|\,)/)) {
                totalPage =
                    parseInt(totalPage.toString().replace(/(\.|\,).*$/, '')) +
                    1;
            }
        } else totalPage = 0;
        response.pagination.totalPage = totalPage;

        // Set has next page
        response.pagination.hasNext = pagination.page
            ? totalPage > pagination.page
            : false;

        return response;
    }
    return;
};

/**
 * Return the skip pagination request
 * @param pagination
 * @returns
 */
export const getPaginationSkip = (pagination: PaginationArg): number => {
    if (!pagination.page || !pagination.limit) {
        return 0;
    }

    const page = pagination.page - 1;

    return page * pagination.limit;
};

/**
 * Get the current user from request
 * @returns
 */
export const getCurrentUser = (): UserPayloadInterface | undefined =>
    RequestContext?.currentContext?.req?.user;

/**
 * Genrate a query with shortcut name
 */
export const prepareQuery = (
    manager: EntityManager,
    queryString: string,
    queryParameters?: ObjectLiteral,
    queryNativeParameters?: ObjectLiteral,
): Promise<any> => {
    const [query, parameters] =
        manager.connection.driver.escapeQueryWithParameters(
            queryString,
            queryParameters || {},
            queryNativeParameters || {},
        );

    return manager.query(query, parameters);
};

export const getColumnName = (
    columnsMap: Map<string, string>,
    column: string,
): string => {
    return columnsMap.get(column);
};

export const addSearch = <T>(
    queryBuilder: SelectQueryBuilder<T>,
    columnQueryNames: Map<string, string>,
    columnNames: string[],
    search?: string,
) => {
    if (search) {
        queryBuilder.andWhere(
            new Brackets((qb) => {
                columnNames.forEach((col) => {
                    qb.orWhere(
                        `${getColumnName(columnQueryNames, col)} ILIKE :search`,
                        {
                            search: `%${search}%`,
                        },
                    );
                });
            }),
        );
    }
};

export const addFilters = <T, S>(
    queryBuilder: SelectQueryBuilder<T>,
    filter: S,
    columnQueryNames: Map<string, string>,
) => {
    const columns = Object.getOwnPropertyNames(filter).filter(
        (col) => col !== 'search',
    );

    columns.forEach((column) => {
        let operator: string;

        if (filter[column] !== undefined && filter[column] !== null) {
            if (Array.isArray(filter[column])) {
                operator = `IN(:...${column})`;
            } else {
                operator = `= :${column}`;
            }
            queryBuilder.andWhere(
                `${getColumnName(columnQueryNames, column)} ${operator}`,
                { [column]: filter[column] },
            );
        }
    });
};

export const addSorting = <T>(
    queryBuilder: SelectQueryBuilder<T>,
    sort: DatabaseSortArg,
    columnQueryNames: Map<string, string>,
) => {
    queryBuilder.sortResult(sort, (column) =>
        getColumnName(columnQueryNames, column),
    );
};
