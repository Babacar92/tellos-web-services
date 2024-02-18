import { EntityFilterArgInput } from './entity.filter.arg.input';
import { DatabaseSortArg } from '../../../../libs/databases/dto/args/database.sort.arg';
import { Transform } from 'class-transformer';

export class EntityExportPdfArgInput {
    /**
     * The filter for export
     */
    @Transform(({ value }) =>
        typeof value === 'string' ? JSON.parse(value) : value,
    )
    public filter: EntityFilterArgInput;

    /**
     * The sort for export
     */
    @Transform(({ value }) =>
        typeof value === 'string' ? JSON.parse(value) : value,
    )
    public sort: DatabaseSortArg;

    /**
     * The columns for export
     */
    @Transform(({ value }) =>
        typeof value === 'string' ? JSON.parse(value) : value,
    )
    public columns: string[];
}
