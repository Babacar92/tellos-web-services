import { Transform } from 'class-transformer';
import { DatabaseSortArg } from '../../../../libs/databases/dto/args/database.sort.arg';
import { CustomerFilterArgInput } from './customer.filter.arg.input';

export class CustomerExportArgInput {
  /**
   * The filter for export
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  public filter: CustomerFilterArgInput;

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
