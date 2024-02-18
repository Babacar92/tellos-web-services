import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model, ProjectionType, QueryOptions,} from 'mongoose';
import {PaginationArg} from 'src/libs/databases/dto/args/pagination.arg';
import {ResultPaginationInterface} from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import {ActionLog, ActionLogDocument} from '../../../entities/mongodb/ActionLogSchema';
import {ACTION_LOG_MONGODB_CONN_NAME} from '../../../libs/databases/databases.module';
import {ActionLogFilterArg} from '../dto/args/action-log.filter.arg';
import {ActionLogArgInput} from '../dto/args/action-log.new.arg.input';
import {getPaginationSkip, buildPaginationResult} from '../../../libs/databases/utils/db.utils';
import {DatabaseSortArg} from 'src/libs/databases/dto/args/database.sort.arg';
import {RequestContext} from 'nestjs-request-context';
import {ACTION_LOG_TYPES} from '../dto/types/actions.types.enum';
import {dump} from '../../../utils/utils';

/**
 * Action log servie
 */
@Injectable()
export class ActionLogService {

    /**
     * The sortable columns
     */
    public static sortableColumns: any = {
        "user.id": true,
        "type": true,
        "createdAt": true,
    };

    /**
     * The constructor
     * @param _actionLogModel
     */
    public constructor(
        @InjectModel(ActionLog.name, ACTION_LOG_MONGODB_CONN_NAME)
        private readonly _actionLogModel: Model<ActionLogDocument>,
    ) {

    }

    /**
     * Create new log
     * @param createLog
     * @returns
     */
    public async log(
        createLog: ActionLogArgInput,
    ): Promise<ActionLog> {
        const origin = RequestContext?.currentContext?.req?.headers['origin'];
        const referer = RequestContext?.currentContext?.req?.headers['referer'];
        let root: string;

        if (origin && referer) root = referer.replace(origin, '');
        else root = '/';

        const newLog = new this._actionLogModel({
            ...createLog,
            createdAt: new Date(),
            root: root,
        });

        return newLog.save();
    }

    /**
     * Return all actions logs
     * @param sort
     * @param pagination
     * @param filter
     * @param projection
     * @returns
     */
    public async findAll(
        filter: ActionLogFilterArg,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        transformUser?: (data: ActionLog) => Promise<void>,
        projection?: ProjectionType<any> | null | undefined,
        queryOptions?: QueryOptions,
    ): Promise<{ result: ActionLog[], pagination: ResultPaginationInterface }> {
        return new Promise(async (resolve, reject) => {
            const filters = <FilterQuery<any>>{
                $and: [
                    {
                        "user.entity": filter.LoginEntity,
                    },
                ],
            };

            // Add Search
            if (filter.search) {
                const searchOr = <FilterQuery<any>>{
                    $or: [
                        {
                            type: new RegExp(`.*${filter.search}.*`, 'i'),
                        },
                        {
                            root: new RegExp(`.*${filter.search}.*`, 'i'),
                        },
                    ]
                };

                if (filter.search.match(/[0-9]+((\.|\,)[0-9]+)?/)) {
                    searchOr.$or.push({
                        "user.id": filter.search,
                    });
                }

                // Add search actions
                if (filter.searchActions?.length) searchOr.$or.push({type: filter.searchActions});

                // Add search userIds
                if (filter.searchUserIds?.length) searchOr.$or.push({"user.id": filter.searchUserIds});

                // Add search roots
                if (filter.searchRoots?.length) searchOr.$or.push({root: filter.searchRoots});

                filters.$and.push(searchOr);
            }

            // Add id filter
            if (filter.id) filters.$and.push({_id: filter.id});

            // Add ids filter
            if (filter.ids?.length) filters.$and.push({_id: filter.ids});

            // Add type filter
            if (filter.type) filters.$and.push({type: new RegExp(`.*${filter.type}.*`, 'i')});

            // Add types filter
            if (filter.types?.length) filters.$and.push({type: filter.types});

            // Add root filter
            if (filter.root) filters.$and.push({root: new RegExp(`.*${filter.root}.*`, 'i')});

            // Add roots filter
            if (filter.roots?.length) filters.$and.push({root: filter.roots});

            // Add userId filter
            if (filter.userId) filters.$and.push({"user.id": filter.userId});

            // Add userIds filter
            if (filter.userIds?.length) filters.$and.push({"user.id": filter.userIds});

            // Add date schedule filter
            if (filter.dateSchedule && filter.dateSchedule.from && filter.dateSchedule.to) filters.$and.push({
                createdAt: {
                    $gte: filter.dateSchedule.from,
                    $lte: filter.dateSchedule.to
                }
            });

            // Filter of data
            if (filter.data) {
                for (const key in filter.data) {
                    const value = filter.data[key];
                    const typeOfValue = typeof value;

                    if (typeOfValue === 'string') {
                        filters.$and.push({[`data.${key}`]: new RegExp(`.*${value}.*`, 'i')});
                    } else {
                        filters.$and.push({[`data.${key}`]: value});
                    }
                }
            }

            let response: any;

            try {
                // Get Total
                const total = await this._actionLogModel.find(filters, projection).count();

                // Prepare request
                const req = this._actionLogModel.find(filters, projection, Object.assign((queryOptions || {}), {
                    skip: getPaginationSkip(pagination),
                    limit: pagination.limit,
                }));

                if (sort && Object.keys(sort).length) {
                    let setSort = false;
                    const sortKeys: string[] = Object.keys(sort);
                    const sorts: { [key: string]: 'asc' | 'desc' } = {};

                    for (let i in sortKeys) {
                        const sortKey = sortKeys[i];
                        if (ActionLogService.sortableColumns[sortKey] && sort[sortKey]) {
                            const order = <'asc' | 'desc'>sort[sortKey].toLowerCase();
                            if (order.toString().match(/^(asc|desc)$/i)) {
                                if (!setSort) setSort = true;
                                sorts[sortKey] = <'asc' | 'desc'>sort[sortKey].toLowerCase();
                            }
                        }
                    }

                    if (setSort) req.sort(sorts);
                }

                // Get result
                const result = await req.exec();

                // Transform user
                if (transformUser) {
                    for (const i in result) {
                        const data = result[i];

                        await transformUser(data);
                    }
                }

                response = buildPaginationResult(result, total, pagination);
            } catch (e) {
                response = buildPaginationResult([], 0, pagination);
            }

            resolve(response);
        });
    }
}
