import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';

export const buildSort = (entity: string, sort: DatabaseSortArg) => {
    const objSort = {};
    Object.keys(sort).forEach((key) => {
        objSort[`${entity}.${key}`] = sort[key];
    });
    return objSort;
};
