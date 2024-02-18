import { ActionLog } from "../../entities/mongodb/ActionLogSchema";
import { ACTION_LOG_TYPES } from "../../modules/action-log/dto/types/actions.types.enum";
import { ActionLogService } from "../../modules/action-log/services/action-log.service";
import { dump } from "../../utils/utils";
import { UserPayloadInterface } from "../auth/dto/interfaces/user.payload.interface";
import { getCurrentUser } from "../databases/utils/db.utils";

/**
 * The abstract loggger
 * 
 * For custom log method use at end this method
 * 
 * @example
 * \@Injectable()
 * export class MyClassLogger extends AbstractLogger {
 *    public constructor(
 *        public readonly _actionLogService: ActionLogService,
 *        // Other injected properties...
 *    ) {
 *        super();
 *    }
 * 
 *    //...
 *    public async myMethod(...args) {
 *       // Your treatment
 *       return super._saveLogData(type, data);
 *    }
 *    //...
 *    // If you want to simplify the method you can override it like this
 *    public async create(data: any): Promise<ActionLog> {
 *         return super.create(type, data);
 *    }
 * }
 */
export abstract class AbstractLogger {

    /**
     * The target columns
     */
    public abstract columns: string[];

    /**
     * The entity Class name
     */
    public abstract entityClassName: string;

    /**
     * The action log service
     */
    public abstract readonly _actionLogService: ActionLogService;

    /**
     * The current data
     */
    private data: any;

    /**
     * The old data
     */
    private oldData: any;

    /**
     * The user
     */
    private user: UserPayloadInterface;

    /**
     * Read log for action READ
     * @param type 
     * @param data 
     * @returns 
     */
    public async read(
        type: ACTION_LOG_TYPES,
        data?: any,
    ): Promise<ActionLog> {
        return this._saveLogData(
            type,
            (data || this.data),
        );
    }

    /**
     * Create log for action CREATE
     * @param type 
     * @param data 
     * @returns 
     */
    public async create(
        type: ACTION_LOG_TYPES,
        data?: any,
    ): Promise<ActionLog> {
        return this._saveLogData(
            type,
            (data || this.data),
        );
    }

    /**
     * Update log for action UPDATE
     * @param type 
     * @param data 
     * @param oldData 
     * @returns 
     */
    public async update(
        type: ACTION_LOG_TYPES,
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return this._saveLogData(
            type,
            {
                new: (data || this.data),
                old: (oldData || this.oldData),
            },
        );
    }

    /**
     * Remove log for action REMOVE
     * @param type 
     * @param data 
     * @returns 
     */
    public async remove(
        type: ACTION_LOG_TYPES,
        data?: any,
    ): Promise<ActionLog> {
        return this._saveLogData(
            type,
            (data || this.data),
        );
    }

    /**
     * Define data
     * @param data 
     */
    public setData(data: any): void {
        if (data) {
            this.data = this._getDataByColumns(data);
        }
    }

    /**
     * Define old data
     * @param data 
     */
    public setOldData(data: any): void {
        if (data) {
            this.oldData = this._getDataByColumns(data);
        }
    }

    public setUser(user: UserPayloadInterface): void {
        if (user && user !== this.user) {
            this.user = user;
        }
    }

    /**
     * Save the data as log
     * @param type 
     * @param data 
     * @returns 
     */
    public async _saveLogData(
        type: ACTION_LOG_TYPES,
        data: any,
    ): Promise<ActionLog> {
        const user = this._getCurrentUser();

        if (data.new && data.old) {
            data.new = this._getDataByColumns(data.new);
            data.old = this._getDataByColumns(data.old);
        } else {
            data = this._getDataByColumns(data);
        }

        return <ActionLog>this._actionLogService.log({
            user: {
                id: user?.sub,
                entity: this.entityClassName,
            },
            type: type,
            data: data,
        })
            .then(res => this._clearAndReturnResult(res));
    }

    /**
     * Clear the data
     */
    private _clearAndReturnResult(result: any): void {
        if (this.data) this.data = undefined;
        if (this.oldData) this.oldData = undefined;
        if (this.user) this.user = undefined;

        return result;
    }

    /**
     * Return the data by columns
     * @param data 
     * @returns 
     */
    private _getDataByColumns(data: any): any {
        // Return null if not exists
        if (!data || !data.id) {
            // throw new Error('The data is empty or has not the property ID');
        }

        // Add ID if not exists
        if (!this.columns.includes('id')) this.columns.push('id');

        // Create the returned data
        const returnedData: any = {};

        // Add values
        for (const i in this.columns) {
            const column = this.columns[i];

            const columnData = data[column];
            if (columnData !== null && columnData !== undefined) {
                returnedData[column] = columnData;
            }
        }

        return returnedData;
    }

    /**
     * Get current User
     * @returns 
     */
    private _getCurrentUser(): UserPayloadInterface {
        return getCurrentUser() || this.user;
    }

}